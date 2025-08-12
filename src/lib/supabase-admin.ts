import { createClient } from '@supabase/supabase-js';

// Create Supabase admin client with fallback handling
let supabaseAdmin: any = null;

// Function to create the client
const createSupabaseAdmin = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY;
  
  if (!supabaseUrl || !serviceRoleKey) {
    console.warn('Supabase environment variables not available:', {
      url: supabaseUrl ? 'present' : 'missing',
      key: serviceRoleKey ? 'present' : 'missing'
    });
    return null;
  }

  try {
    return createClient(supabaseUrl, serviceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });
  } catch (error) {
    console.error('Error creating Supabase admin client:', error);
    return null;
  }
};

// Try to create the client immediately
supabaseAdmin = createSupabaseAdmin();

// Export both the client and the creation function for fallback
export { supabaseAdmin, createSupabaseAdmin };
