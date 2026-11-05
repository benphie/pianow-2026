# Supabase Setup Guide for PIANOW

## Step 1: Create a Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Sign up or log in
3. Click "New Project"
4. Fill in:
   - **Name**: pianow (or your preferred name)
   - **Database Password**: Choose a strong password (save it!)
   - **Region**: Choose closest to your users
5. Click "Create new project"
6. Wait for the project to be created (takes 1-2 minutes)

## Step 2: Get Your API Keys

1. In your Supabase project dashboard, go to **Settings** → **API**
2. Copy the following:
   - **Project URL** (e.g., `https://xxxxx.supabase.co`)
   - **anon/public key** (starts with `eyJ...`)
   - **service_role key** (starts with `eyJ...`) - Keep this secret!

## Step 3: Set Up Environment Variables

Create a `.env.local` file in your project root:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your-project-url-here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# JWT Secret (for API authentication)
JWT_SECRET=your-random-secret-key-here-change-this
```

**Important**: 
- Never commit `.env.local` to git (it's already in `.gitignore`)
- `JWT_SECRET` is required and must be at least 32 random characters. Generate one locally with `openssl rand -base64 48` (don't use an online generator), and use a different value in each environment

## Step 4: Create Database Tables

1. In your Supabase dashboard, go to **SQL Editor**
2. Click "New query"
3. Copy and paste the entire contents of `supabase/schema.sql`
4. Click "Run" (or press Ctrl+Enter)
5. You should see "Success. No rows returned"

This will create all the necessary tables:
- `users` - User accounts
- `teachers` - Teacher profiles
- `lessons` - Music lessons
- `products` - Shop products
- `carts` - Shopping carts
- `orders` - Order history

## Step 5: Verify Tables Were Created

1. Go to **Table Editor** in your Supabase dashboard
2. You should see all 6 tables listed
3. Click on any table to see its structure

## Step 6: Test Your Setup

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Try creating a user account through your signup page
3. Check the `users` table in Supabase to see if the user was created

## Row Level Security (RLS)

The schema includes Row Level Security policies:
- Users can only see/update their own data
- Public data (lessons, products, teachers) is viewable by everyone
- Carts and orders are private to each user

## Troubleshooting

### "Invalid API key" error
- Double-check your `.env.local` file
- Make sure you copied the keys correctly (no extra spaces)
- Restart your dev server after changing `.env.local`

### "relation does not exist" error
- Make sure you ran the SQL schema in Step 4
- Check that all tables exist in the Table Editor

### "permission denied" error
- This is likely an RLS policy issue
- Check that your user is authenticated
- Verify the RLS policies in the SQL Editor

## Next Steps

- Add sample data to your tables for testing
- Set up authentication providers (Google, GitHub, etc.) if needed
- Configure email templates for password reset
- Set up database backups

## Production Checklist

Before deploying to production:
- [ ] Change `JWT_SECRET` to a strong random value
- [ ] Review and adjust RLS policies as needed
- [ ] Set up database backups
- [ ] Configure custom domain (optional)
- [ ] Set up monitoring and alerts
- [ ] Review API rate limits

## Support

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Discord](https://discord.supabase.com)
- [Supabase GitHub](https://github.com/supabase/supabase)
