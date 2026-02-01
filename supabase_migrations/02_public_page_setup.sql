-- Faz 5: Public Sayfa için Database Migration
-- Bu dosyayı Supabase SQL Editor'da çalıştırın

-- 1. Profiles tablosu (eğer yoksa)
CREATE TABLE IF NOT EXISTS profiles (
    id UUID REFERENCES auth.users(id) PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    display_name TEXT,
    bio TEXT,
    avatar_url TEXT,
    email TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Page Views tablosu (Analytics için)
CREATE TABLE IF NOT EXISTS page_views (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    page_id UUID REFERENCES pages(id) ON DELETE CASCADE,
    viewed_at TIMESTAMPTZ DEFAULT NOW(),
    ip_address TEXT,
    user_agent TEXT,
    referrer TEXT
);

-- 3. Block Clicks tablosu (Analytics için)
CREATE TABLE IF NOT EXISTS block_clicks (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    block_id UUID REFERENCES blocks(id) ON DELETE CASCADE,
    page_id UUID REFERENCES pages(id) ON DELETE CASCADE,
    clicked_at TIMESTAMPTZ DEFAULT NOW(),
    ip_address TEXT
);

-- 4. Indexes
CREATE INDEX IF NOT EXISTS idx_page_views_page_id ON page_views(page_id);
CREATE INDEX IF NOT EXISTS idx_page_views_viewed_at ON page_views(viewed_at);
CREATE INDEX IF NOT EXISTS idx_block_clicks_block_id ON block_clicks(block_id);
CREATE INDEX IF NOT EXISTS idx_block_clicks_page_id ON block_clicks(page_id);
CREATE INDEX IF NOT EXISTS idx_block_clicks_clicked_at ON block_clicks(clicked_at);
CREATE INDEX IF NOT EXISTS idx_profiles_username ON profiles(username);

-- 5. RLS Policies

-- Profiles: Herkes okuyabilir (public page için gerekli)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON profiles;
CREATE POLICY "Profiles are viewable by everyone"
    ON profiles FOR SELECT
    USING (true);

DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
CREATE POLICY "Users can update own profile"
    ON profiles FOR UPDATE
    USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
CREATE POLICY "Users can insert own profile"
    ON profiles FOR INSERT
    WITH CHECK (auth.uid() = id);

-- Page Views: Herkes insert edebilir (anonim tracking)
ALTER TABLE page_views ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can insert page views" ON page_views;
CREATE POLICY "Anyone can insert page views"
    ON page_views FOR INSERT
    WITH CHECK (true);

DROP POLICY IF EXISTS "Users can view own page views" ON page_views;
CREATE POLICY "Users can view own page views"
    ON page_views FOR SELECT
    USING (
        page_id IN (
            SELECT id FROM pages WHERE user_id = auth.uid()
        )
    );

-- Block Clicks: Herkes insert edebilir
ALTER TABLE block_clicks ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can insert block clicks" ON block_clicks;
CREATE POLICY "Anyone can insert block clicks"
    ON block_clicks FOR INSERT
    WITH CHECK (true);

DROP POLICY IF EXISTS "Users can view own block clicks" ON block_clicks;
CREATE POLICY "Users can view own block clicks"
    ON block_clicks FOR SELECT
    USING (
        page_id IN (
            SELECT id FROM pages WHERE user_id = auth.uid()
        )
    );

-- 6. Published pages: Herkes okuyabilir
DROP POLICY IF EXISTS "Published pages are viewable by everyone" ON pages;
CREATE POLICY "Published pages are viewable by everyone"
    ON pages FOR SELECT
    USING (is_published = true);

-- 7. Blocks: Yayınlanmış sayfalara ait bloklar herkes tarafından okunabilir
DROP POLICY IF EXISTS "Blocks of published pages are viewable by everyone" ON blocks;
CREATE POLICY "Blocks of published pages are viewable by everyone"
    ON blocks FOR SELECT
    USING (
        page_id IN (
            SELECT id FROM pages WHERE is_published = true
        )
    );
