-- ============================================
-- RUN THIS SQL IN SUPABASE SQL EDITOR
-- Dashboard → SQL Editor → New Query → Paste & Run
-- ============================================

-- 1. Update Profiles Table
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS karma INTEGER DEFAULT 0;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS badges JSONB DEFAULT '[]'::jsonb;

-- 2. Update Resources Table
ALTER TABLE resources ADD COLUMN IF NOT EXISTS summary TEXT DEFAULT '';
ALTER TABLE resources ADD COLUMN IF NOT EXISTS flags_count INTEGER DEFAULT 0;

-- 3. Requests Table
CREATE TABLE IF NOT EXISTS requests (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    subject TEXT NOT NULL,
    description TEXT,
    status TEXT NOT NULL DEFAULT 'Open' CHECK (status IN ('Open', 'Fulfilled', 'Closed')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Collections Table
CREATE TABLE IF NOT EXISTS collections (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    is_public BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Collection Items Table
CREATE TABLE IF NOT EXISTS collection_items (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    collection_id UUID NOT NULL REFERENCES collections(id) ON DELETE CASCADE,
    resource_id UUID NOT NULL REFERENCES resources(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(collection_id, resource_id)
);

-- 6. Notifications Table
CREATE TABLE IF NOT EXISTS notifications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    type TEXT NOT NULL, -- 'request_fulfilled', 'new_resource', 'resource_reviewed', 'new_follower'
    message TEXT NOT NULL,
    resource_id UUID REFERENCES resources(id) ON DELETE SET NULL,
    request_id UUID REFERENCES requests(id) ON DELETE SET NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Follows Table
CREATE TABLE IF NOT EXISTS follows (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    subject TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, subject)
);

-- 8. Reports Table
CREATE TABLE IF NOT EXISTS reports (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    reporter_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    resource_id UUID NOT NULL REFERENCES resources(id) ON DELETE CASCADE,
    reason TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'Pending' CHECK (status IN ('Pending', 'Resolved', 'Dismissed')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_requests_user_id ON requests(user_id);
CREATE INDEX IF NOT EXISTS idx_collections_user_id ON collections(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_follows_user_id ON follows(user_id);
CREATE INDEX IF NOT EXISTS idx_reports_resource_id ON reports(resource_id);

-- RLS Policies

-- Requests
ALTER TABLE requests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public requests are viewable by everyone" ON requests FOR SELECT USING (true);
CREATE POLICY "Users can create requests" ON requests FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own requests" ON requests FOR UPDATE USING (auth.uid() = user_id);
-- Fulfillments might require update logic; simpler to rely on service role or separate fulfillment logic
-- But let's allow users to update their own requests for now.

-- Collections
ALTER TABLE collections ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public collections are viewable by everyone" ON collections FOR SELECT USING (is_public = true OR user_id = auth.uid());
CREATE POLICY "Users can create collections" ON collections FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own collections" ON collections FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own collections" ON collections FOR DELETE USING (auth.uid() = user_id);

-- Collection Items
ALTER TABLE collection_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Items viewable if user can view collection" ON collection_items FOR SELECT USING (
    (SELECT is_public FROM collections WHERE id = collection_id) = true OR 
    (SELECT user_id FROM collections WHERE id = collection_id) = auth.uid()
);
CREATE POLICY "Users can add items to their collections" ON collection_items FOR INSERT WITH CHECK (
    (SELECT user_id FROM collections WHERE id = collection_id) = auth.uid()
);
CREATE POLICY "Users can remove items from their collections" ON collection_items FOR DELETE USING (
    (SELECT user_id FROM collections WHERE id = collection_id) = auth.uid()
);

-- Notifications
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own notifications" ON notifications FOR SELECT USING (auth.uid() = user_id);
-- Notifications are usually created by triggers orbackend service, so user insert might not be needed.
-- We'll rely on service role for creating notifications.

-- Follows
ALTER TABLE follows ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own follows" ON follows FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create follows" ON follows FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete follows" ON follows FOR DELETE USING (auth.uid() = user_id);

-- Reports
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can create reports" ON reports FOR INSERT WITH CHECK (auth.uid() = reporter_id);
-- Only admins see all reports, but we don't have admins yet.
-- Enable view for reporter for now?
CREATE POLICY "Users can view their own reports" ON reports FOR SELECT USING (auth.uid() = reporter_id);

-- Triggers for updated_at
CREATE TRIGGER set_requests_updated_at BEFORE UPDATE ON requests FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER set_collections_updated_at BEFORE UPDATE ON collections FOR EACH ROW EXECUTE FUNCTION update_updated_at();
