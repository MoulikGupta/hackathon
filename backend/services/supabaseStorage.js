const supabase = require('../config/supabaseClient');

const bucket = process.env.SUPABASE_STORAGE_BUCKET || 'documents';

/**
 * Upload a file to Supabase Storage.
 * @param {Buffer} fileBuffer - The file content as a Buffer.
 * @param {string} filePath - The destination path within the bucket.
 * @param {string} contentType - The MIME type of the file.
 * @returns {Promise<{data: object, error: object|null}>}
 */
async function uploadFile(fileBuffer, filePath, contentType) {
    const { data, error } = await supabase.storage
        .from(bucket)
        .upload(filePath, fileBuffer, {
            contentType,
            upsert: false,
        });

    if (error) {
        throw new Error(`Upload failed: ${error.message}`);
    }

    return data;
}

/**
 * Delete a file from Supabase Storage.
 * @param {string} filePath - The path of the file to delete within the bucket.
 * @returns {Promise<{data: object, error: object|null}>}
 */
async function deleteFile(filePath) {
    const { data, error } = await supabase.storage
        .from(bucket)
        .remove([filePath]);

    if (error) {
        throw new Error(`Delete failed: ${error.message}`);
    }

    return data;
}

/**
 * Get the public URL for a file in Supabase Storage.
 * @param {string} filePath - The path of the file within the bucket.
 * @returns {string} The public URL.
 */
function getPublicUrl(filePath) {
    const { data } = supabase.storage
        .from(bucket)
        .getPublicUrl(filePath);

    return data.publicUrl;
}

module.exports = {
    uploadFile,
    deleteFile,
    getPublicUrl,
};
