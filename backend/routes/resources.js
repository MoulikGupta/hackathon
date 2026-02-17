const express = require('express');
const router = express.Router();
const multer = require('multer');
const supabase = require('../config/supabaseClient');
const verifySupabaseToken = require('../middleware/verifySupabaseToken');
const { uploadFile, deleteFile, getPublicUrl } = require('../services/supabaseStorage');

// Multer config — store in memory buffer before uploading to Supabase
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 50 * 1024 * 1024 }, // 50MB
    fileFilter: (req, file, cb) => {
        const allowed = [
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'application/vnd.ms-powerpoint',
            'application/vnd.openxmlformats-officedocument.presentationml.presentation',
            'image/jpeg',
            'image/png',
            'image/webp',
        ];
        if (allowed.includes(file.mimetype)) cb(null, true);
        else cb(new Error('Unsupported file type'), false);
    },
});

// ─── POST /api/resources — Upload resource ─────────────────────────
router.post('/', verifySupabaseToken, upload.single('file'), async (req, res) => {
    try {
        const userId = req.user.id;
        const { title, subject, semester, resource_type, year, description, is_public, college } = req.body;

        if (!req.file || !title || !subject) {
            return res.status(400).json({ error: 'File, title, and subject are required' });
        }

        const resourceId = require('crypto').randomUUID();
        const filePath = `${userId}/${resourceId}/${req.file.originalname}`;

        // Upload to Supabase Storage
        const { error: uploadError } = await uploadFile(req.file.buffer, filePath, req.file.mimetype);
        if (uploadError) {
            return res.status(500).json({ error: 'Storage upload failed', details: uploadError.message });
        }

        // Insert into resources table (correct columns only)
        const { data, error } = await supabase
            .from('resources')
            .insert({
                id: resourceId,
                uploader_id: userId,
                title,
                subject,
                semester: semester || null,
                resource_type: resource_type || null,
                year: year ? parseInt(year) : null,
                description: description || '',
                file_path: filePath,
                college: college || '',
                is_public: is_public === 'true' || is_public === true,
            })
            .select()
            .single();

        if (error) {
            // Cleanup uploaded file
            await deleteFile(filePath);
            return res.status(500).json({ error: 'Database insert failed', details: error.message });
        }

        res.status(201).json({ success: true, resource: data });
    } catch (err) {
        console.error('Upload error:', err);
        res.status(500).json({ error: err.message });
    }
});

// ─── GET /api/resources — List resources ────────────────────────────
router.get('/', async (req, res) => {
    try {
        const { semester, resource_type, is_public, search, sort, page = 1, limit = 20 } = req.query;

        let query = supabase.from('resources').select('*', { count: 'exact' });

        if (semester && semester !== 'All') query = query.eq('semester', semester);
        if (resource_type && resource_type !== 'All') query = query.eq('resource_type', resource_type);
        if (is_public !== undefined) query = query.eq('is_public', is_public === 'true');

        if (search) {
            query = query.or(`title.ilike.%${search}%,subject.ilike.%${search}%`);
        }

        if (sort === 'oldest') {
            query = query.order('created_at', { ascending: true });
        } else {
            query = query.order('created_at', { ascending: false });
        }

        const from = (parseInt(page) - 1) * parseInt(limit);
        const to = from + parseInt(limit) - 1;
        query = query.range(from, to);

        const { data, error, count } = await query;
        if (error) return res.status(500).json({ error: error.message });

        res.json({
            resources: data,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total: count,
            },
        });
    } catch (err) {
        console.error('Fetch resources error:', err);
        res.status(500).json({ error: err.message });
    }
});

// ─── GET /api/resources/:id — Get single resource ──────────────────
router.get('/:id', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('resources')
            .select('*')
            .eq('id', req.params.id)
            .single();

        if (error || !data) {
            return res.status(404).json({ error: 'Resource not found' });
        }

        // Get public URL for download
        const downloadUrl = getPublicUrl(data.file_path);

        res.json({ resource: data, downloadUrl });
    } catch (err) {
        console.error('Fetch resource error:', err);
        res.status(500).json({ error: err.message });
    }
});

// ─── DELETE /api/resources/:id — Delete resource ────────────────────
router.delete('/:id', verifySupabaseToken, async (req, res) => {
    try {
        const userId = req.user.id;

        // Verify ownership
        const { data: resource, error: fetchErr } = await supabase
            .from('resources')
            .select('uploader_id, file_path')
            .eq('id', req.params.id)
            .single();

        if (fetchErr || !resource) {
            return res.status(404).json({ error: 'Resource not found' });
        }

        if (resource.uploader_id !== userId) {
            return res.status(403).json({ error: 'Not authorized to delete this resource' });
        }

        // Delete from storage
        if (resource.file_path) {
            await deleteFile(resource.file_path);
        }

        // Delete from database
        const { error } = await supabase
            .from('resources')
            .delete()
            .eq('id', req.params.id);

        if (error) return res.status(500).json({ error: error.message });

        res.json({ success: true, message: 'Resource deleted' });
    } catch (err) {
        console.error('Delete error:', err);
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
