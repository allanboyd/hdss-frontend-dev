# Environment Variables Setup

This guide explains how to set up your environment variables for the site management system.

## Required Environment Variables

Create a `.env.local` file in your project root with the following variables:

```env
# Supabase Configuration
# Replace these with your actual Supabase project credentials

# Your Supabase project URL (found in your Supabase dashboard under Settings > API)
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co

# Your Supabase anon/public key (for client-side operations)
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here

# Your Supabase service role key (for server-side operations that bypass RLS)
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# Optional: Auth redirect URL (defaults to localhost:3000)
NEXT_PUBLIC_AUTH_REDIRECT_URL=http://localhost:3000/dashboard

# Optional: Site URL for development
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

## How to Get Your Supabase Credentials

### Step 1: Go to Your Supabase Dashboard

1. Visit [supabase.com](https://supabase.com)
2. Sign in to your account
3. Select your project (or create a new one)

### Step 2: Get Your Project URL

1. Go to **Settings** → **API**
2. Copy the **Project URL** (looks like `https://abcdefghijklmnop.supabase.co`)

### Step 3: Get Your Anon Key

1. In the same **Settings** → **API** section
2. Copy the **anon public** key (starts with `eyJ...`)
3. This is used for client-side operations like authentication

### Step 4: Get Your Service Role Key

1. In the same **Settings** → **API** section
2. Copy the **service_role** key (starts with `eyJ...`)
3. This is used for server-side operations that bypass Row Level Security (RLS)

## Key Differences

### Anon Key (`NEXT_PUBLIC_SUPABASE_ANON_KEY`)

- **Used for**: Client-side operations, authentication
- **Security**: Respects Row Level Security (RLS) policies
- **Access**: Limited by RLS policies you define
- **Example usage**: User login, reading data based on user permissions

### Service Role Key (`SUPABASE_SERVICE_ROLE_KEY`)

- **Used for**: Server-side operations, admin functions
- **Security**: Bypasses Row Level Security (RLS)
- **Access**: Full database access
- **Example usage**: CRUD operations in admin panels, data management

## Security Best Practices

### ✅ Do's

- Use anon key for client-side operations
- Use service role key only for admin/server operations
- Keep service role key secret (never expose in client code)
- Use RLS policies to secure your data

### ❌ Don'ts

- Never expose service role key in client-side code
- Don't use service role key for regular user operations
- Don't commit `.env.local` to version control
- Don't use anon key for operations that need to bypass RLS

## Example .env.local

```env
NEXT_PUBLIC_SUPABASE_URL=https://abcdefghijklmnop.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1ub3AiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTYzNjQ5NjAwMCwiZXhwIjoxOTUyMDcyMDAwfQ.example
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1ub3AiLCJyb2xlIjoic2VydmljZV9yb2xlIiwiaWF0IjoxNjM2NDk2MDAwLCJleHAiOjE5NTIwNzIwMDB9.example
NEXT_PUBLIC_AUTH_REDIRECT_URL=http://localhost:3000/dashboard
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

## After Setting Up

1. **Restart your development server:**

   ```bash
   npm run dev
   ```

2. **Test the authentication:**
   - Try logging in/out
   - Check if auth errors are resolved

3. **Test the site management system:**
   - Navigate to `/dashboard/site-management`
   - Try creating, reading, updating, and deleting records

## Troubleshooting

### Common Issues

1. **"Invalid API key" error**
   - Check that your keys are copied correctly
   - Make sure there are no extra spaces or characters

2. **"Service role key not found" error**
   - Ensure `SUPABASE_SERVICE_ROLE_KEY` is set in `.env.local`
   - Restart your development server

3. **"Permission denied" errors**
   - Check that RLS policies are properly configured
   - Verify you're using the correct key for the operation

4. **Environment variables not loading**
   - Make sure the file is named `.env.local` (not `.env`)
   - Restart your development server
   - Check that the file is in the project root

### Verification Steps

1. **Check environment variables are loaded:**

   ```javascript
   console.log('SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
   console.log(
     'ANON_KEY:',
     process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Set' : 'Not set'
   );
   console.log(
     'SERVICE_ROLE_KEY:',
     process.env.SUPABASE_SERVICE_ROLE_KEY ? 'Set' : 'Not set'
   );
   ```

2. **Test database connection:**
   - Try accessing the site management page
   - Check browser console for any errors
   - Verify data loads correctly

## Support

If you encounter issues:

1. Check the troubleshooting section above
2. Verify your Supabase project is active
3. Ensure all environment variables are set correctly
4. Restart your development server
