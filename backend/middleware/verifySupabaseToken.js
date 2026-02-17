const supabase = require('../config/supabaseClient');

/**
 * Middleware to verify Supabase JWT tokens.
 * Reads the Authorization header, extracts the Bearer token,
 * verifies it with Supabase, and attaches the user to req.user.
 */
async function verifySupabaseToken(req, res, next) {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ error: 'Missing or invalid Authorization header' });
        }

        const token = authHeader.split(' ')[1];

        const { data, error } = await supabase.auth.getUser(token);

        if (error || !data?.user) {
            return res.status(401).json({ error: 'Invalid or expired token' });
        }

        req.user = data.user;
        next();
    } catch (err) {
        console.error('Token verification error:', err.message);
        return res.status(500).json({ error: 'Internal server error during authentication' });
    }
}

module.exports = verifySupabaseToken;
