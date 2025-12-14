-- ============================================================================
-- FIX RAPIDE - Désactiver RLS pour auth hybride
-- ============================================================================
-- Exécutez ce script sur Supabase pour désactiver RLS sur toutes les tables
-- Cela permet à l'app de fonctionner avec Supabase Auth + user_id TEXT
-- ============================================================================

-- Désactiver RLS sur user_profiles
ALTER TABLE IF EXISTS public.user_profiles DISABLE ROW LEVEL SECURITY;

-- Désactiver RLS sur toutes les tables maison_finances
ALTER TABLE IF EXISTS public.maison_finances DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.sante_data DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.revenu_data DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.biens_data DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.vieillesse_data DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.fortune_data DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.immobilier_data DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.budget_data DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.fiscalite_data DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.juridique_data DISABLE ROW LEVEL SECURITY;

-- Vérification
SELECT tablename, rowsecurity
FROM pg_tables
WHERE tablename IN (
  'maison_finances', 'sante_data', 'revenu_data', 'biens_data',
  'vieillesse_data', 'fortune_data', 'immobilier_data',
  'budget_data', 'fiscalite_data', 'juridique_data', 'user_profiles'
)
ORDER BY tablename;

-- Résultat attendu: rowsecurity = false pour toutes les tables
