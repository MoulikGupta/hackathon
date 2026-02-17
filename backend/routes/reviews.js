const express = require('express');
const router = express.Router({ mergeParams: true });
const supabase = require('../config/supabaseClient');
const verifySupabaseToken = require('../middleware/verifySupabaseToken');

// ─── POST /api/resources/:id/reviews — Add or update review (upsert) ─
router.post('/', verifySupabaseToken, async (req, res) => {
    try {
        const resourceId = req.params.id;
        const { rating, comment } = req.body;

        if (!rating || rating < 1 || rating > 5) {
            return res.status(400).json({ error: 'Rating must be between 1 and 5' });
        }

        // Verify resource exists
        const { data: resource, error: resErr } = await supabase
            .from('resources')
            .select('id')
            .eq('id', resourceId)
            .single();

        if (resErr || !resource) return res.status(404).json({ error: 'Resource not found' });

        // Get user display info
        const userName = req.user.user_metadata?.full_name || req.user.email?.split('@')[0] || 'Anonymous';
        const userAvatar = req.user.user_metadata?.avatar_url || '';

        // Upsert review (one per user per resource)
        const { data: review, error } = await supabase
            .from('reviews')
            .upsert(
                {
                    resource_id: resourceId,
                    user_id: req.user.id,
                    rating: parseInt(rating),
                    comment: comment || '',
                    user_name: userName,
                    user_avatar: userAvatar,
                },
                { onConflict: 'resource_id,user_id' }
            )
            .select()
            .single();

        if (error) throw error;

        // Recalculate average rating for the resource
        const { data: allReviews, error: revErr } = await supabase
            .from('reviews')
            .select('rating')
            .eq('resource_id', resourceId);

        if (!revErr && allReviews) {
            const avgRating = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;
            await supabase
                .from('resources')
                .update({
                    avg_rating: parseFloat(avgRating.toFixed(2)),
                    review_count: allReviews.length,
                })
                .eq('id', resourceId);
        }

        res.status(201).json({ message: 'Review submitted', review });
    } catch (err) {
        console.error('Review error:', err.message);
        res.status(500).json({ error: 'Failed to submit review' });
    }
});

// ─── GET /api/resources/:id/reviews — List reviews for a resource ────
router.get('/', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('reviews')
            .select('*')
            .eq('resource_id', req.params.id)
            .order('created_at', { ascending: false });

        if (error) throw error;

        res.json({ reviews: data || [] });
    } catch (err) {
        console.error('Fetch reviews error:', err.message);
        res.status(500).json({ error: 'Failed to fetch reviews' });
    }
});

module.exports = router;
