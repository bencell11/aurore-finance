-- Re-enable RLS for production
-- Run this when you're ready to deploy to production with proper authentication

-- Enable RLS on all tables
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE financial_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE real_estate_favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE real_estate_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE generated_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE mortgage_simulations ENABLE ROW LEVEL SECURITY;
