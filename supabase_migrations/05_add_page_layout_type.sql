-- Add layout_type column to pages table
ALTER TABLE pages 
ADD COLUMN IF NOT EXISTS layout_type TEXT DEFAULT 'classic' CHECK (layout_type IN ('classic', 'special'));
