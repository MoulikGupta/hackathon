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

        // Upsert review using only columns that exist in the schema
        const { data, error } = await supabase
            .from('reviews')
            .upsert(
                {
                    resource_id: resourceId,
                    user_id: req.user.id,
                    rating: parseInt(rating),
                    comment: comment || '',
                },
                { onConflict: 'resource_id,user_id' }
            )
            .select()
            .single();

        if (error) {
            return res.status(500).json({ error: error.message });
        }

        res.status(201).json({ success: true, review: data });
    } catch (err) {
        console.error('Review error:', err);
        res.status(500).json({ error: err.message });
    }
});

// ─── GET /api/resources/:id/reviews — Get reviews for a resource ────
router.get('/', async (req, res) => {
    try {
        const resourceId = req.params.id;

        const { data, error } = await supabase
            .from('reviews')
            .select('*')
            .eq('resource_id', resourceId)
            .order('created_at', { ascending: false });

        if (error) {
            return res.status(500).json({ error: error.message });
        }

        res.json({ reviews: data || [] });
    } catch (err) {
        console.error('Fetch reviews error:', err);
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
