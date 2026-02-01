-- Page Views tablosuna yeni kolonlar ekle
ALTER TABLE page_views 
ADD COLUMN IF NOT EXISTS device_type TEXT,
ADD COLUMN IF NOT EXISTS browser TEXT,
ADD COLUMN IF NOT EXISTS os TEXT,
ADD COLUMN IF NOT EXISTS country TEXT;
