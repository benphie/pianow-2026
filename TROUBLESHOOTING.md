# Troubleshooting Login and Signup Issues

## Common Issues and Solutions

### 1. "Database connection failed" Error

**Problem:** You see an error message about database connection.

**Solution:**
1. Check if you have a `.env.local` file in your project root
2. Verify your Supabase credentials are correct:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   JWT_SECRET=your-secret
   ```
3. Make sure you've run the SQL schema in Supabase (see `supabase/schema.sql`)
4. Restart your development server after adding/changing `.env.local`

### 2. "User with this email already exists" (Signup)

**Problem:** You're trying to sign up with an email that's already registered.

**Solution:**
- Use a different email address, or
- Try logging in instead if you already have an account

### 3. "Invalid email or password" (Login)

**Problem:** Login fails even with correct credentials.

**Possible causes:**
- The user doesn't exist in the database
- Password was entered incorrectly
- Database tables haven't been created yet

**Solution:**
1. Make sure you've run the SQL schema in Supabase
2. Try creating a new account first
3. Check the browser console for detailed error messages

### 4. No Error Message, Just Fails Silently

**Problem:** Login/signup doesn't work but no error is shown.

**Solution:**
1. Open browser Developer Tools (F12)
2. Check the Console tab for error messages
3. Check the Network tab to see if API calls are failing
4. Look for CORS errors or 500 errors

### 5. "Supabase is not configured" Warning

**Problem:** You see a warning in the console about Supabase not being configured.

**Solution:**
1. Create a `.env.local` file in your project root
2. Add your Supabase credentials (see `.env.local.example`)
3. Restart your dev server: `npm run dev`

## Step-by-Step Setup Checklist

- [ ] Created Supabase project at [supabase.com](https://supabase.com)
- [ ] Got API keys from Supabase dashboard (Settings → API)
- [ ] Created `.env.local` file with credentials
- [ ] Ran SQL schema in Supabase SQL Editor (`supabase/schema.sql`)
- [ ] Verified tables exist in Supabase Table Editor
- [ ] Restarted development server
- [ ] Checked browser console for errors

## Testing Your Setup

1. **Check Environment Variables:**
   ```bash
   # In your terminal, check if variables are loaded
   # (They won't show values, but should not error)
   node -e "console.log(process.env.NEXT_PUBLIC_SUPABASE_URL ? 'Set' : 'Missing')"
   ```

2. **Test Database Connection:**
   - Go to Supabase dashboard → Table Editor
   - Try to view the `users` table
   - If it doesn't exist, run the schema SQL again

3. **Test API Endpoint:**
   - Open browser DevTools → Network tab
   - Try to sign up
   - Check if `/api/auth/signup` request appears
   - Check the response status and error message

## Getting Help

If you're still having issues:

1. **Check the browser console** for detailed error messages
2. **Check the terminal** where `npm run dev` is running for server errors
3. **Verify Supabase setup:**
   - Can you access your Supabase dashboard?
   - Are the tables visible in Table Editor?
   - Are your API keys correct?

4. **Common Error Messages:**
   - `relation "users" does not exist` → Run the SQL schema
   - `Invalid API key` → Check your `.env.local` file
   - `Network error` → Check your internet connection and Supabase project status

## Quick Fix: Reset Everything

If nothing works, try this:

1. Delete `.env.local` and recreate it
2. In Supabase dashboard, go to SQL Editor
3. Drop all tables (if they exist):
   ```sql
   DROP TABLE IF EXISTS orders CASCADE;
   DROP TABLE IF EXISTS carts CASCADE;
   DROP TABLE IF EXISTS products CASCADE;
   DROP TABLE IF EXISTS lessons CASCADE;
   DROP TABLE IF EXISTS teachers CASCADE;
   DROP TABLE IF EXISTS users CASCADE;
   ```
4. Run the full schema from `supabase/schema.sql` again
5. Restart your dev server
6. Try signing up again
