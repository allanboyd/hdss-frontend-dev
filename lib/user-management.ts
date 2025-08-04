import { supabase } from './supabase'
import { supabaseAdmin } from './supabase-admin'
import { handleAuthError } from './auth-utils'
import {
  Role,
  UserProfile,
  SiteUser,
  UserAccountRequest,
  UserManagementCounts,
  CreateRoleForm,
  CreateUserProfileForm,
  CreateSiteUserForm,
  CreateUserAccountRequestForm,
  UpdateUserAccountRequestForm
} from '@/types/user-management'

// Helper function to handle Supabase errors
const handleSupabaseError = async (error: any) => {
  if (error?.message?.includes('Invalid Refresh Token') || 
      error?.message?.includes('Refresh Token Not Found')) {
    const result = await handleAuthError(error)
    if (result.shouldRedirect && result.redirectTo) {
      window.location.href = result.redirectTo
      return { data: null, error: 'Authentication required' }
    }
  }
  return { data: null, error }
}

// Role CRUD operations
export const roleService = {
  async getAll(): Promise<Role[]> {
    try {
      const { data, error } = await supabaseAdmin
        .from('role')
        .select('*')
        .order('role_name')
      
      if (error) {
        const handledError = await handleSupabaseError(error)
        if (handledError.error) throw new Error(handledError.error)
        throw error
      }
      return data || []
    } catch (error) {
      console.error('Error loading roles:', error)
      throw error
    }
  },

  async getById(id: number): Promise<Role | null> {
    try {
      const { data, error } = await supabaseAdmin
        .from('role')
        .select('*')
        .eq('role_id', id)
        .single()
      
      if (error) {
        const handledError = await handleSupabaseError(error)
        if (handledError.error) throw new Error(handledError.error)
        throw error
      }
      return data
    } catch (error) {
      console.error('Error loading role:', error)
      throw error
    }
  },

  async create(role: CreateRoleForm): Promise<Role> {
    try {
      const { data, error } = await supabaseAdmin
        .from('role')
        .insert(role)
        .select()
        .single()
      
      if (error) {
        const handledError = await handleSupabaseError(error)
        if (handledError.error) throw new Error(handledError.error)
        throw error
      }
      return data
    } catch (error) {
      console.error('Error creating role:', error)
      throw error
    }
  },

  async update(id: number, updates: Partial<CreateRoleForm>): Promise<Role> {
    try {
      const { data, error } = await supabaseAdmin
        .from('role')
        .update(updates)
        .eq('role_id', id)
        .select()
        .single()
      
      if (error) {
        const handledError = await handleSupabaseError(error)
        if (handledError.error) throw new Error(handledError.error)
        throw error
      }
      return data
    } catch (error) {
      console.error('Error updating role:', error)
      throw error
    }
  },

  async delete(id: number): Promise<void> {
    try {
      const { error } = await supabaseAdmin
        .from('role')
        .delete()
        .eq('role_id', id)
      
      if (error) {
        const handledError = await handleSupabaseError(error)
        if (handledError.error) throw new Error(handledError.error)
        throw error
      }
    } catch (error) {
      console.error('Error deleting role:', error)
      throw error
    }
  }
}

// User Profile CRUD operations
export const userProfileService = {
  async getAll(): Promise<UserProfile[]> {
    try {
      const { data, error } = await supabaseAdmin
        .from('user_profile')
        .select(`
          *,
          role:role_id(*),
          site:site_id(*)
        `)
        .order('full_name')
      
      if (error) {
        const handledError = await handleSupabaseError(error)
        if (handledError.error) throw new Error(handledError.error)
        throw error
      }
      return data || []
    } catch (error) {
      console.error('Error loading user profiles:', error)
      throw error
    }
  },

  async getById(id: number): Promise<UserProfile | null> {
    try {
      const { data, error } = await supabaseAdmin
        .from('user_profile')
        .select(`
          *,
          role:role_id(*),
          site:site_id(*)
        `)
        .eq('user_id', id)
        .single()
      
      if (error) {
        const handledError = await handleSupabaseError(error)
        if (handledError.error) throw new Error(handledError.error)
        throw error
      }
      return data
    } catch (error) {
      console.error('Error loading user profile:', error)
      throw error
    }
  },

  async create(userProfile: CreateUserProfileForm): Promise<UserProfile> {
    try {
      // First create the auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: userProfile.email,
        password: userProfile.password,
        options: {
          data: {
            full_name: userProfile.full_name,
            username: userProfile.username
          }
        }
      })

      if (authError) {
        throw new Error(`Auth error: ${authError.message}`)
      }

      if (!authData.user) {
        throw new Error('Failed to create auth user')
      }

      // Then create the user profile
      const { data, error } = await supabaseAdmin
        .from('user_profile')
        .insert({
          auth_user_id: authData.user.id,
          username: userProfile.username,
          email: userProfile.email,
          full_name: userProfile.full_name,
          phone_number: userProfile.phone_number,
          role_id: userProfile.role_id,
          site_id: userProfile.site_id,
          status: userProfile.status
        })
        .select(`
          *,
          role:role_id(*),
          site:site_id(*)
        `)
        .single()
      
      if (error) {
        const handledError = await handleSupabaseError(error)
        if (handledError.error) throw new Error(handledError.error)
        throw error
      }
      return data
    } catch (error) {
      console.error('Error creating user profile:', error)
      throw error
    }
  },

  async update(id: number, updates: Partial<CreateUserProfileForm>): Promise<UserProfile> {
    try {
      const { data, error } = await supabaseAdmin
        .from('user_profile')
        .update(updates)
        .eq('user_id', id)
        .select(`
          *,
          role:role_id(*),
          site:site_id(*)
        `)
        .single()
      
      if (error) {
        const handledError = await handleSupabaseError(error)
        if (handledError.error) throw new Error(handledError.error)
        throw error
      }
      return data
    } catch (error) {
      console.error('Error updating user profile:', error)
      throw error
    }
  },

  async delete(id: number): Promise<void> {
    try {
      const { error } = await supabaseAdmin
        .from('user_profile')
        .delete()
        .eq('user_id', id)
      
      if (error) {
        const handledError = await handleSupabaseError(error)
        if (handledError.error) throw new Error(handledError.error)
        throw error
      }
    } catch (error) {
      console.error('Error deleting user profile:', error)
      throw error
    }
  }
}

// Site User CRUD operations
export const siteUserService = {
  async getAll(): Promise<SiteUser[]> {
    try {
      const { data, error } = await supabaseAdmin
        .from('site_user')
        .select(`
          *,
          site:site_id(*),
          role:role_id(*),
          user_profile:user_profile_id(*)
        `)
        .order('created_at', { ascending: false })
      
      if (error) {
        const handledError = await handleSupabaseError(error)
        if (handledError.error) throw new Error(handledError.error)
        throw error
      }
      return data || []
    } catch (error) {
      console.error('Error loading site users:', error)
      throw error
    }
  },

  async getByUser(userId: number): Promise<SiteUser[]> {
    try {
      const { data, error } = await supabaseAdmin
        .from('site_user')
        .select(`
          *,
          site:site_id(*),
          role:role_id(*),
          user_profile:user_profile_id(*)
        `)
        .eq('user_profile_id', userId)
        .order('created_at', { ascending: false })
      
      if (error) {
        const handledError = await handleSupabaseError(error)
        if (handledError.error) throw new Error(handledError.error)
        throw error
      }
      return data || []
    } catch (error) {
      console.error('Error loading site users by user:', error)
      throw error
    }
  },

  async create(siteUser: CreateSiteUserForm): Promise<SiteUser> {
    try {
      const { data, error } = await supabaseAdmin
        .from('site_user')
        .insert(siteUser)
        .select(`
          *,
          site:site_id(*),
          role:role_id(*),
          user_profile:user_profile_id(*)
        `)
        .single()
      
      if (error) {
        const handledError = await handleSupabaseError(error)
        if (handledError.error) throw new Error(handledError.error)
        throw error
      }
      return data
    } catch (error) {
      console.error('Error creating site user:', error)
      throw error
    }
  },

  async update(id: number, updates: Partial<CreateSiteUserForm>): Promise<SiteUser> {
    try {
      const { data, error } = await supabaseAdmin
        .from('site_user')
        .update(updates)
        .eq('site_user_id', id)
        .select(`
          *,
          site:site_id(*),
          role:role_id(*),
          user_profile:user_profile_id(*)
        `)
        .single()
      
      if (error) {
        const handledError = await handleSupabaseError(error)
        if (handledError.error) throw new Error(handledError.error)
        throw error
      }
      return data
    } catch (error) {
      console.error('Error updating site user:', error)
      throw error
    }
  },

  async delete(id: number): Promise<void> {
    try {
      const { error } = await supabaseAdmin
        .from('site_user')
        .delete()
        .eq('site_user_id', id)
      
      if (error) {
        const handledError = await handleSupabaseError(error)
        if (handledError.error) throw new Error(handledError.error)
        throw error
      }
    } catch (error) {
      console.error('Error deleting site user:', error)
      throw error
    }
  }
}

// User Account Request CRUD operations
export const userAccountRequestService = {
  async getAll(): Promise<UserAccountRequest[]> {
    try {
      const { data, error } = await supabaseAdmin
        .from('user_account_request')
        .select(`
          *,
          requested_role:requested_role_id(*),
          requested_site:requested_site_id(*),
          reviewer:reviewed_by(*)
        `)
        .order('created_at', { ascending: false })
      
      if (error) {
        const handledError = await handleSupabaseError(error)
        if (handledError.error) throw new Error(handledError.error)
        throw error
      }
      return data || []
    } catch (error) {
      console.error('Error loading account requests:', error)
      throw error
    }
  },

  async getByStatus(status: 'pending' | 'approved' | 'rejected'): Promise<UserAccountRequest[]> {
    try {
      const { data, error } = await supabaseAdmin
        .from('user_account_request')
        .select(`
          *,
          requested_role:requested_role_id(*),
          requested_site:requested_site_id(*),
          reviewer:reviewed_by(*)
        `)
        .eq('status', status)
        .order('created_at', { ascending: false })
      
      if (error) {
        const handledError = await handleSupabaseError(error)
        if (handledError.error) throw new Error(handledError.error)
        throw error
      }
      return data || []
    } catch (error) {
      console.error('Error loading account requests by status:', error)
      throw error
    }
  },

  async create(request: CreateUserAccountRequestForm): Promise<UserAccountRequest> {
    try {
      const { data, error } = await supabaseAdmin
        .from('user_account_request')
        .insert(request)
        .select(`
          *,
          requested_role:requested_role_id(*),
          requested_site:requested_site_id(*),
          reviewer:reviewed_by(*)
        `)
        .single()
      
      if (error) {
        const handledError = await handleSupabaseError(error)
        if (handledError.error) throw new Error(handledError.error)
        throw error
      }
      return data
    } catch (error) {
      console.error('Error creating account request:', error)
      throw error
    }
  },

  async update(id: number, updates: UpdateUserAccountRequestForm): Promise<UserAccountRequest> {
    try {
      const { data, error } = await supabaseAdmin
        .from('user_account_request')
        .update({
          ...updates,
          reviewed_at: new Date().toISOString()
        })
        .eq('request_id', id)
        .select(`
          *,
          requested_role:requested_role_id(*),
          requested_site:requested_site_id(*),
          reviewer:reviewed_by(*)
        `)
        .single()
      
      if (error) {
        const handledError = await handleSupabaseError(error)
        if (handledError.error) throw new Error(handledError.error)
        throw error
      }
      return data
    } catch (error) {
      console.error('Error updating account request:', error)
      throw error
    }
  },

  async delete(id: number): Promise<void> {
    try {
      const { error } = await supabaseAdmin
        .from('user_account_request')
        .delete()
        .eq('request_id', id)
      
      if (error) {
        const handledError = await handleSupabaseError(error)
        if (handledError.error) throw new Error(handledError.error)
        throw error
      }
    } catch (error) {
      console.error('Error deleting account request:', error)
      throw error
    }
  }
}

// User management counts service
export const userManagementCountsService = {
  async getCounts(): Promise<UserManagementCounts | null> {
    try {
      const { data, error } = await supabaseAdmin
        .from('user_management_counts')
        .select('*')
        .single()
      
      if (error) {
        // If the view doesn't exist (404 error), return default counts
        if (error.code === 'PGRST116' || 
            error.message?.includes('relation "user_management_counts" does not exist') || 
            error.message?.includes('404') ||
            error.message?.includes('Not Found') ||
            error.message?.includes('does not exist')) {
          console.warn('user_management_counts view not found, returning default counts')
          return {
            roles_count: 0,
            users_count: 0,
            pending_requests_count: 0,
            total_requests_count: 0,
            last_updated: new Date().toISOString()
          }
        }
        
        const handledError = await handleSupabaseError(error)
        if (handledError.error) throw new Error(handledError.error)
        throw error
      }
      return data
    } catch (error) {
      console.error('Error loading user management counts:', error)
      // Return default counts on any error
      return {
        roles_count: 0,
        users_count: 0,
        pending_requests_count: 0,
        total_requests_count: 0,
        last_updated: new Date().toISOString()
      }
    }
  }
} 