const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

/**
 * Get the current session's access token.
 */
async function getToken() {
    const { supabase } = await import('./supabaseClient');
    const { data: { session } } = await supabase.auth.getSession();
    return session?.access_token || null;
}

/**
 * Authenticated fetch wrapper.
 */
async function apiFetch(path, options = {}) {
    const token = await getToken();
    const headers = { ...options.headers };
    if (token) headers['Authorization'] = `Bearer ${token}`;
    // Don't set Content-Type for FormData; browser sets it with boundary
    if (!(options.body instanceof FormData)) {
        headers['Content-Type'] = 'application/json';
    }

    const res = await fetch(`${API_BASE}${path}`, { ...options, headers });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Request failed');
    return data;
}

// ─── Resources API ──────────────────────────────────────────────────

export async function uploadResource(formData) {
    return apiFetch('/api/resources', { method: 'POST', body: formData });
}

export async function fetchResources(params = {}) {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => { if (v) query.set(k, v); });
    return apiFetch(`/api/resources?${query.toString()}`);
}

export async function fetchResource(id) {
    return apiFetch(`/api/resources/${id}`);
}

export async function updateResource(id, data) {
    return apiFetch(`/api/resources/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
    });
}

export async function deleteResource(id) {
    return apiFetch(`/api/resources/${id}`, { method: 'DELETE' });
}

export async function downloadResource(id) {
    return apiFetch(`/api/resources/${id}/download`, { method: 'POST' });
}

// ─── Reviews API ────────────────────────────────────────────────────

export async function submitReview(resourceId, { rating, comment }) {
    return apiFetch(`/api/resources/${resourceId}/reviews`, {
        method: 'POST',
        body: JSON.stringify({ rating, comment }),
    });
}

export async function fetchReviews(resourceId) {
    return apiFetch(`/api/resources/${resourceId}/reviews`);
}
