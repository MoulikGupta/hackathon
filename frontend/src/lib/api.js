import { supabase } from './supabaseClient';

// ─── Profiles API ───────────────────────────────────────────────────

export async function fetchProfile(userId) {
    const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

    if (error && error.code !== 'PGRST116') throw error; // PGRST116 = no rows
    return data;
}

export async function upsertProfile(profileData) {
    const { data, error } = await supabase
        .from('profiles')
        .upsert(profileData, { onConflict: 'id' })
        .select()
        .single();

    if (error) throw error;
    return data;
}

// ─── Resources API ──────────────────────────────────────────────────

export async function uploadResource({ file, title, subject, semester, resource_type, year, description, is_public, college, userId }) {
    // Ensure the profile row exists (FK: resources.uploader_id → profiles.id)
    const { data: existingProfile } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', userId)
        .single();

    if (!existingProfile) {
        const { error: profileErr } = await supabase
            .from('profiles')
            .upsert({ id: userId }, { onConflict: 'id' });

        if (profileErr) {
            console.warn('Profile ensure warning:', profileErr.message);
        }
    }

    // Generate unique resource ID
    const resourceId = crypto.randomUUID();
    const filePath = `${userId}/${resourceId}/${file.name}`;

    // Upload file to Supabase Storage
    const { error: uploadError } = await supabase.storage
        .from('documents')
        .upload(filePath, file);

    if (uploadError) throw new Error(`Upload failed: ${uploadError.message}`);

    // Insert resource record
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
            is_public: is_public !== false, // default true
        })
        .select()
        .single();

    if (error) {
        // Cleanup uploaded file if DB insert fails
        await supabase.storage.from('documents').remove([filePath]);
        throw error;
    }

    return data;
}

export async function fetchResources(params = {}) {
    let query = supabase.from('resources').select('*');

    // Filters — only use columns that exist
    if (params.semester && params.semester !== 'All') {
        query = query.eq('semester', params.semester);
    }
    if (params.resource_type && params.resource_type !== 'All') {
        query = query.eq('resource_type', params.resource_type);
    }
    if (params.is_public !== undefined) {
        query = query.eq('is_public', params.is_public);
    }
    if (params.uploader_id) {
        query = query.eq('uploader_id', params.uploader_id);
    }
    if (params.college && params.college !== 'All') {
        query = query.eq('college', params.college);
    }

    // Search (title or subject)
    if (params.search) {
        query = query.or(`title.ilike.%${params.search}%,subject.ilike.%${params.search}%`);
    }

    // Sorting
    if (params.sort === 'oldest') {
        query = query.order('created_at', { ascending: true });
    } else {
        query = query.order('created_at', { ascending: false });
    }

    // Pagination
    const page = parseInt(params.page) || 1;
    const limit = parseInt(params.limit) || 20;
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    query = query.range(from, to);

    const { data, error } = await query;
    if (error) throw error;

    return { resources: data || [], page, limit };
}

export async function fetchResource(id) {
    const { data, error } = await supabase
        .from('resources')
        .select('*')
        .eq('id', id)
        .single();

    if (error) throw error;
    return { resource: data };
}

export async function deleteResource(id, filePath) {
    // Delete file from storage
    if (filePath) {
        try {
            await supabase.storage.from('documents').remove([filePath]);
        } catch (e) {
            console.warn('File delete warning:', e.message);
        }
    }

    // Delete from database
    const { error } = await supabase
        .from('resources')
        .delete()
        .eq('id', id);

    if (error) throw error;
}

export function getResourceDownloadUrl(filePath) {
    const { data } = supabase.storage
        .from('documents')
        .getPublicUrl(filePath);

    return data.publicUrl;
}

export async function fetchUserResources(userId) {
    const { data, error } = await supabase
        .from('resources')
        .select('*')
        .eq('uploader_id', userId)
        .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
}

// ─── Reviews API ────────────────────────────────────────────────────

export async function submitReview(resourceId, userId, { rating, comment }) {
    const { data, error } = await supabase
        .from('reviews')
        .upsert(
            {
                resource_id: resourceId,
                user_id: userId,
                rating: parseInt(rating),
                comment: comment || '',
            },
            { onConflict: 'resource_id,user_id' }
        )
        .select()
        .single();

    if (error) throw error;
    return data;
}

export async function fetchReviews(resourceId) {
    const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .eq('resource_id', resourceId)
        .order('created_at', { ascending: false });

    if (error) throw error;
    return { reviews: data || [] };
}

// ─── Tags API (optional helpers) ────────────────────────────────────

export async function fetchTags() {
    const { data, error } = await supabase
        .from('tags')
        .select('*')
        .order('name');

    if (error) throw error;
    return data || [];
}

export async function addTagsToResource(resourceId, tagNames) {
    if (!tagNames || tagNames.length === 0) return;

    for (const name of tagNames) {
        const trimmed = name.trim().toLowerCase();
        if (!trimmed) continue;

        // Upsert tag
        let { data: tag, error: tagErr } = await supabase
            .from('tags')
            .select('id')
            .eq('name', trimmed)
            .single();

        if (!tag) {
            const { data: newTag, error: insertErr } = await supabase
                .from('tags')
                .insert({ name: trimmed })
                .select()
                .single();
            if (insertErr) {
                console.warn('Tag insert error:', insertErr.message);
                continue;
            }
            tag = newTag;
        }

        // Link tag to resource
        await supabase
            .from('resource_tags')
            .upsert({ resource_id: resourceId, tag_id: tag.id }, { onConflict: 'resource_id,tag_id' });
    }
}

export async function fetchResourceTags(resourceId) {
    const { data, error } = await supabase
        .from('resource_tags')
        .select('tag_id, tags(name)')
        .eq('resource_id', resourceId);

    if (error) {
        console.warn('Fetch tags error:', error.message);
        return [];
    }

    return (data || []).map(rt => rt.tags?.name).filter(Boolean);
}

// ─── Leaderboard API ────────────────────────────────────────────────

export async function fetchLeaderboard() {
    // Get all profiles
    const { data: profiles, error: profErr } = await supabase
        .from('profiles')
        .select('id, full_name, college, branch, semester, avatar_url');

    if (profErr) throw profErr;

    // Get upload counts per user
    const { data: resources, error: resErr } = await supabase
        .from('resources')
        .select('uploader_id');

    if (resErr) throw resErr;

    // Count uploads per user
    const uploadCounts = {};
    (resources || []).forEach(r => {
        uploadCounts[r.uploader_id] = (uploadCounts[r.uploader_id] || 0) + 1;
    });

    // Build leaderboard
    const leaderboard = (profiles || []).map(p => ({
        id: p.id,
        name: p.full_name || 'Anonymous',
        college: p.college || '',
        branch: p.branch || '',
        semester: p.semester || '',
        avatar_url: p.avatar_url || '',
        uploads: uploadCounts[p.id] || 0,
        karma: (uploadCounts[p.id] || 0) * 50,
    }));

    // Sort by karma descending
    leaderboard.sort((a, b) => b.karma - a.karma);

    return leaderboard;
}
