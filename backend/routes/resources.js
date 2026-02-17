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
            'image/jpeg', 'image/png', 'image/webp',
            'application/zip',
            'text/plain',
        ];
        if (allowed.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('File type not supported'), false);
        }
    }
});

// ─── POST /api/resources — Upload a resource ───────────────────────
router.post('/', verifySupabaseToken, upload.single('file'), async (req, res) => {
    try {
        const file = req.file;
        if (!file) return res.status(400).json({ error: 'No file uploaded' });

        const { title, subject, department, semester, type, description, tags, year_batch, privacy, college } = req.body;
        if (!title || !subject) return res.status(400).json({ error: 'Title and subject are required' });

        // Generate unique file path
        const ext = file.originalname.split('.').pop();
        const filePath = `${req.user.id}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

        // Upload to Supabase Storage
        await uploadFile(file.buffer, filePath, file.mimetype);
        const fileUrl = getPublicUrl(filePath);

        // Parse tags
        let parsedTags = [];
        if (tags) {
            try {
                parsedTags = JSON.parse(tags);
            } catch {
                parsedTags = tags.split(',').map(t => t.trim()).filter(Boolean);
            }
        }

        // Insert into database
        const { data, error } = await supabase
            .from('resources')
            .insert({
                user_id: req.user.id,
                title,
                subject,
                department: department || 'CSE',
                semester: semester || '1st Sem',
                type: type || 'Notes',
                description: description || '',
                tags: parsedTags,
                year_batch: year_batch || '',
                privacy: privacy || 'public',
                college: college || '',
                file_path: filePath,
                file_url: fileUrl,
                file_name: file.originalname,
                file_size: file.size,
            })
            .select()
            .single();

        if (error) throw error;

        res.status(201).json({ message: 'Resource uploaded successfully', resource: data });
    } catch (err) {
        console.error('Upload error:', err.message);
        res.status(500).json({ error: err.message || 'Upload failed' });
    }
});

// ─── GET /api/resources — List / Search / Filter ────────────────────
router.get('/', async (req, res) => {
    try {
        const {
            search, department, semester, type, privacy,
            sort, user_id, page = 1, limit = 20
        } = req.query;

        let query = supabase.from('resources').select('*');

        // Filters
        if (department && department !== 'All') query = query.eq('department', department);
        if (semester && semester !== 'All') query = query.eq('semester', semester);
        if (type && type !== 'All') query = query.eq('type', type);
        if (privacy && privacy !== 'All') query = query.eq('privacy', privacy);
        if (user_id) query = query.eq('user_id', user_id);

        // Search (title, subject, or tags)
        if (search) {
            query = query.or(`title.ilike.%${search}%,subject.ilike.%${search}%`);
        }

        // Sorting
        switch (sort) {
            case 'rating':
                query = query.order('avg_rating', { ascending: false });
                break;
            case 'popular':
                query = query.order('downloads', { ascending: false });
                break;
            case 'oldest':
                query = query.order('created_at', { ascending: true });
                break;
            default: // 'latest'
                query = query.order('created_at', { ascending: false });
        }

        // Pagination
        const from = (parseInt(page) - 1) * parseInt(limit);
        const to = from + parseInt(limit) - 1;
        query = query.range(from, to);

        const { data, error, count } = await query;
        if (error) throw error;

        res.json({ resources: data || [], page: parseInt(page), limit: parseInt(limit) });
    } catch (err) {
        console.error('Fetch resources error:', err.message);
        res.status(500).json({ error: 'Failed to fetch resources' });
    }
});

// ─── GET /api/resources/:id — Single resource detail ────────────────
router.get('/:id', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('resources')
            .select('*')
            .eq('id', req.params.id)
            .single();

        if (error) throw error;
        if (!data) return res.status(404).json({ error: 'Resource not found' });

        res.json({ resource: data });
    } catch (err) {
        console.error('Fetch resource error:', err.message);
        res.status(500).json({ error: 'Failed to fetch resource' });
    }
});

// ─── PUT /api/resources/:id — Edit resource (owner only) ────────────
router.put('/:id', verifySupabaseToken, async (req, res) => {
    try {
        // Check ownership
        const { data: existing, error: fetchErr } = await supabase
            .from('resources')
            .select('user_id')
            .eq('id', req.params.id)
            .single();

        if (fetchErr || !existing) return res.status(404).json({ error: 'Resource not found' });
        if (existing.user_id !== req.user.id) return res.status(403).json({ error: 'Not authorized' });

        const { title, subject, department, semester, type, description, tags, year_batch, privacy } = req.body;

        let parsedTags;
        if (tags) {
            try { parsedTags = JSON.parse(tags); } catch { parsedTags = tags.split(',').map(t => t.trim()).filter(Boolean); }
        }

        const updates = {};
        if (title) updates.title = title;
        if (subject) updates.subject = subject;
        if (department) updates.department = department;
        if (semester) updates.semester = semester;
        if (type) updates.type = type;
        if (description !== undefined) updates.description = description;
        if (parsedTags) updates.tags = parsedTags;
        if (year_batch) updates.year_batch = year_batch;
        if (privacy) updates.privacy = privacy;

        const { data, error } = await supabase
            .from('resources')
            .update(updates)
            .eq('id', req.params.id)
            .select()
            .single();

        if (error) throw error;

        res.json({ message: 'Resource updated', resource: data });
    } catch (err) {
        console.error('Update error:', err.message);
        res.status(500).json({ error: 'Failed to update resource' });
    }
});

// ─── DELETE /api/resources/:id — Delete resource (owner only) ───────
router.delete('/:id', verifySupabaseToken, async (req, res) => {
    try {
        const { data: existing, error: fetchErr } = await supabase
            .from('resources')
            .select('user_id, file_path')
            .eq('id', req.params.id)
            .single();

        if (fetchErr || !existing) return res.status(404).json({ error: 'Resource not found' });
        if (existing.user_id !== req.user.id) return res.status(403).json({ error: 'Not authorized' });

        // Delete file from storage
        try { await deleteFile(existing.file_path); } catch (e) { console.warn('File delete warning:', e.message); }

        // Delete from database
        const { error } = await supabase.from('resources').delete().eq('id', req.params.id);
        if (error) throw error;

        res.json({ message: 'Resource deleted' });
    } catch (err) {
        console.error('Delete error:', err.message);
        res.status(500).json({ error: 'Failed to delete resource' });
    }
});

// ─── POST /api/resources/:id/download — Increment download count ────
router.post('/:id/download', async (req, res) => {
    try {
        const { data: resource, error: fetchErr } = await supabase
            .from('resources')
            .select('downloads, file_url')
            .eq('id', req.params.id)
            .single();

        if (fetchErr || !resource) return res.status(404).json({ error: 'Resource not found' });

        await supabase
            .from('resources')
            .update({ downloads: (resource.downloads || 0) + 1 })
            .eq('id', req.params.id);

        res.json({ file_url: resource.file_url });
    } catch (err) {
        res.status(500).json({ error: 'Download failed' });
    }
});

module.exports = router;
