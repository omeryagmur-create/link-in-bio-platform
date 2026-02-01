-- Faz 9: Custom Domain ve SEO Migration
ALTER TABLE pages 
ADD COLUMN IF NOT EXISTS seo_title TEXT,
ADD COLUMN IF NOT EXISTS seo_description TEXT,
ADD COLUMN IF NOT EXISTS custom_domain TEXT UNIQUE;

-- Index for performance
CREATE INDEX IF NOT EXISTS idx_pages_custom_domain ON pages(custom_domain);
