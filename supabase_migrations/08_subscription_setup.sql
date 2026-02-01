-- Abonelik ve Plan Limitleri için Database Migration
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS subscription_tier TEXT DEFAULT 'free',
ADD COLUMN IF NOT EXISTS stripe_customer_id TEXT,
ADD COLUMN IF NOT EXISTS stripe_subscription_id TEXT;

-- Check constraint for tier
-- ALTER TABLE profiles ADD CONSTRAINT check_tier CHECK (subscription_tier IN ('free', 'pro'));
