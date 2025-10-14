-- Disable RLS for development (TEMPORARY - DO NOT USE IN PRODUCTION)
-- Run this in Supabase SQL Editor if you're having RLS issues during development

-- Disable RLS on all tables
ALTER TABLE user_profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE financial_goals DISABLE ROW LEVEL SECURITY;
ALTER TABLE real_estate_favorites DISABLE ROW LEVEL SECURITY;
ALTER TABLE real_estate_alerts DISABLE ROW LEVEL SECURITY;
ALTER TABLE generated_documents DISABLE ROW LEVEL SECURITY;
ALTER TABLE ai_conversations DISABLE ROW LEVEL SECURITY;
ALTER TABLE mortgage_simulations DISABLE ROW LEVEL SECURITY;

-- Note: Remember to re-enable RLS before going to production!
-- Use the enable-rls-prod.sql script when ready for production.
