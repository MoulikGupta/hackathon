/**
 * Database Setup Script
 * Run once: node setupDb.js
 * Prints the SQL to create tables — paste it into Supabase Dashboard SQL Editor.
 */
require('dotenv').config();
const supabase = require('./config/supabaseClient');

async function setupDatabase() {
    console.log('🔧 StudySync Inspire — Database Setup\n');

    const sql = `
-- ============================================
-- RUN THIS SQL IN SUPABASE SQL EDITOR
-- Dashboard → SQL Editor → New Query → Paste & Run
-- ============================================

-- Resources table
CREATE TABLE IF NOT EXISTS resources (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL,
    title TEXT NOT NULL,
    subject TEXT NOT NULL,
    department TEXT NOT NULL DEFAULT 'CSE',
    semester TEXT NOT NULL DEFAULT '1st Sem',
    type TEXT NOT NULL DEFAULT 'Notes',
    description TEXT DEFAULT '',
    tags TEXT[] DEFAULT '{}',
    year_batch TEXT DEFAULT '',
    privacy TEXT NOT NULL DEFAULT 'public' CHECK (privacy IN ('public', 'private')),
    college TEXT DEFAULT '',
    file_path TEXT NOT NULL,
    file_url TEXT NOT NULL,
    file_name TEXT NOT NULL,
    file_size BIGINT DEFAULT 0,
    downloads INTEGER DEFAULT 0,
    avg_rating NUMERIC(3,2) DEFAULT 0,
    review_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Reviews table
CREATE TABLE IF NOT EXISTS reviews (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    resource_id UUID NOT NULL REFERENCES resources(id) ON DELETE CASCADE,
    user_id UUID NOT NULL,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT DEFAULT '',
    user_name TEXT DEFAULT '',
    user_avatar TEXT DEFAULT '',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(resource_id, user_id)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_resources_user_id ON resources(user_id);
CREATE INDEX IF NOT EXISTS idx_resources_department ON resources(department);
CREATE INDEX IF NOT EXISTS idx_resources_semester ON resources(semester);
CREATE INDEX IF NOT EXISTS idx_resources_type ON resources(type);
CREATE INDEX IF NOT EXISTS idx_resources_privacy ON resources(privacy);
CREATE INDEX IF NOT EXISTS idx_resources_created_at ON resources(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_resources_avg_rating ON resources(avg_rating DESC);
CREATE INDEX IF NOT EXISTS idx_resources_downloads ON resources(downloads DESC);
CREATE INDEX IF NOT EXISTS idx_resources_tags ON resources USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_reviews_resource_id ON reviews(resource_id);

-- Enable Row Level Security
ALTER TABLE resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Allow all access via service role (backend uses service key)
CREATE POLICY "Allow all for service role" ON resources FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for service role" ON reviews FOR ALL USING (true) WITH CHECK (true);

-- Updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to resources
DROP TRIGGER IF EXISTS set_resources_updated_at ON resources;
CREATE TRIGGER set_resources_updated_at
    BEFORE UPDATE ON resources
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

-- Apply trigger to reviews
DROP TRIGGER IF EXISTS set_reviews_updated_at ON reviews;
CREATE TRIGGER set_reviews_updated_at
    BEFORE UPDATE ON reviews
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();
`;

    console.log('📋 Copy and run the following SQL in your Supabase Dashboard:');
    console.log('   Dashboard → SQL Editor → New Query → Paste & Run\n');
    console.log('='.repeat(60));
    console.log(sql);
    console.log('='.repeat(60));

    // Verify connection by checking if tables exist
    console.log('\n🔌 Verifying Supabase connection...');
    try {
        const { data, error } = await supabase.from('resources').select('id').limit(1);
        if (error && error.code === '42P01') {
            console.log('⚠️  Table "resources" does not exist yet. Please run the SQL above first.');
        } else if (error) {
            console.log('⚠️  Error:', error.message);
        } else {
            console.log('✅ Connection successful! Tables already exist.');
        }
    } catch (e) {
        console.log('⚠️  Could not verify:', e.message);
    }
}

setupDatabase();
