# Troubleshooting Guide - Aurore Finance

## Supabase Connection Errors

### Error: `invalid input syntax for type uuid`

**Symptom**: You see errors like:
```
GET https://gldvcudowxielzrpdsxz.supabase.co/rest/v1/user_profiles?select=*&user_id=eq.user_1760405465595_liqtmsa 400 (Bad Request)
invalid input syntax for type uuid: "user_1760405465595_liqtmsa"
```

**Cause**: Row Level Security (RLS) is enabled on your Supabase tables, but the RLS policies are checking for `current_setting('app.current_user_id')` which is never set. This causes the database to reject queries.

**Solution**:

1. **Option 1: Disable RLS for development (RECOMMENDED FOR TESTING)**

   Run this SQL in your Supabase SQL Editor:
   ```sql
   -- Copy and paste content from lib/supabase/disable-rls-dev.sql
   ALTER TABLE user_profiles DISABLE ROW LEVEL SECURITY;
   ALTER TABLE financial_goals DISABLE ROW LEVEL SECURITY;
   ALTER TABLE real_estate_favorites DISABLE ROW LEVEL SECURITY;
   ALTER TABLE real_estate_alerts DISABLE ROW LEVEL SECURITY;
   ALTER TABLE generated_documents DISABLE ROW LEVEL SECURITY;
   ALTER TABLE ai_conversations DISABLE ROW LEVEL SECURITY;
   ALTER TABLE mortgage_simulations DISABLE ROW LEVEL SECURITY;
   ```

   **WARNING**: Remember to re-enable RLS before production! Use `lib/supabase/enable-rls-prod.sql`

2. **Option 2: Use service_role key** (Already configured in .env.local)

   Your current setup uses the service_role key, which should bypass RLS. If this doesn't work, use Option 1 instead.

3. **Option 3: Configure proper authentication**

   Implement NextAuth or Supabase Auth and set the user ID context properly. This is the production-ready approach but requires more work.

---

## Real Estate Search Not Working

### Error: `POST /api/real-estate/search 500 (Internal Server Error)`

**Symptom**: The recherche-biens-v2 page shows a 500 error when searching.

**Possible Causes**:

1. **OpenAI API Key issues**: Check your `.env.local` has a valid `OPENAI_API_KEY`

2. **Missing dependencies**: Run `npm install` to ensure all packages are installed

3. **Dev server not restarted**: After changing `.env.local`, restart the dev server:
   ```bash
   pkill -9 -f "next dev"
   rm -rf .next
   npm run dev
   ```

4. **Check API logs**: Look at the terminal where `npm run dev` is running to see the actual error

---

## Document Generation Not Working

### Symptom: Cannot generate or save documents

**Possible Causes**:

1. **Supabase not configured**: Documents page works without Supabase, but auto-completion won't work. Check console for warnings like:
   ```
   [UserProfileContext] ⚠️ Could not load profile (Supabase may not be configured)
   ```

2. **OpenAI API issues**: Document generation requires OpenAI API. Check `.env.local` for valid `OPENAI_API_KEY`

3. **Browser console errors**: Open Chrome DevTools → Console to see JavaScript errors

**Solution**: The document generation should work independently of Supabase. If it doesn't:

1. Check browser console for errors
2. Verify OpenAI API key is valid
3. Restart dev server after any `.env.local` changes

---

## Application Won't Start

### Error: Port 3000 already in use

**Solution**:
```bash
# Kill all Next.js processes
pkill -9 -f "next dev"

# Wait a moment
sleep 2

# Clean build cache
rm -rf .next

# Restart
npm run dev
```

---

## Auto-fill Not Working

### Symptom: Form fields don't auto-populate with user data

**Expected Behavior**:
- ✅ **WITH Supabase configured**: Forms auto-fill from database
- ✅ **WITHOUT Supabase**: Forms work normally, just no auto-fill

**Troubleshooting**:

1. **Check console logs**: You should see one of:
   - `[UserProfileContext] ✓ Profile loaded successfully` (working)
   - `[UserProfileContext] ℹ️ No profile found (Supabase may not be configured)` (expected without Supabase)
   - `[UserProfileContext] ⚠️ Could not load profile: ...` (error, but app still works)

2. **Verify Supabase setup**:
   - Tables created (run `lib/supabase/schema.sql`)
   - RLS disabled for dev (run `lib/supabase/disable-rls-dev.sql`)
   - Correct URL and keys in `.env.local`

3. **Test manually**: Fill out a form and submit. Data should be saved to Supabase and appear on next page load.

---

## Cache/Build Issues

### Symptom: Changes not reflecting, or weird errors after git pull

**Solution**:
```bash
# Full clean restart
pkill -9 -f "next dev"
rm -rf .next
rm -rf node_modules/.cache
npm install
npm run dev
```

---

## Deployment Issues (Vercel)

### Error: Build fails on Vercel

**Common Causes**:

1. **Missing environment variables**: Make sure you've added to Vercel:
   - `OPENAI_API_KEY`
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `NEXTAUTH_SECRET`
   - `NEXTAUTH_URL` (set to your Vercel URL)

2. **TypeScript errors**: Run locally first:
   ```bash
   npm run build
   ```
   Fix any TypeScript errors before deploying.

3. **Package.json issues**: Make sure all dependencies are in `dependencies`, not `devDependencies`

---

## Need More Help?

1. **Check browser console** (F12 → Console tab) for JavaScript errors
2. **Check terminal** where `npm run dev` runs for server errors
3. **Check Supabase logs** in Supabase dashboard → Logs
4. **Check OpenAI usage** at platform.openai.com to verify API key works

## Quick Checklist

Before asking for help, verify:

- [ ] `.env.local` has valid API keys
- [ ] Dev server restarted after `.env.local` changes
- [ ] Supabase tables created (run `schema.sql`)
- [ ] RLS disabled for dev (run `disable-rls-dev.sql`)
- [ ] `npm install` completed without errors
- [ ] No TypeScript errors (`npm run build`)
- [ ] Browser console shows no critical errors
- [ ] Port 3000 is available (no other dev servers running)
