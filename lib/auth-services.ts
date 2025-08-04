import { supabase } from './supabase'
import { supabaseAdmin } from './supabase-admin'
import { Role } from '@/types/user-management'
import { Site } from '@/types/site-management'

// Service to fetch public roles (is_public = true)
export const authServices = {
  async getSystemRoles(): Promise<Role[]> {
    try {
      console.log('Fetching system roles from database...')
      const { data, error } = await supabaseAdmin
        .from('role')
        .select('*')
        .eq('is_system', true)
        .order('role_name')
      
      if (error) {
        console.error('Error loading system roles:', error)
        // Return fallback data if there's an error
        return [
          { role_id: 1, role_name: 'Data Collector', description: 'Field data collection and entry', is_default: true, is_system: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
          { role_id: 2, role_name: 'Researcher', description: 'Research and analysis activities', is_default: false, is_system: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
          { role_id: 3, role_name: 'Viewer', description: 'Read-only access to data', is_default: false, is_system: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() }
        ]
      }
      console.log('Successfully loaded roles:', data)
      return data || []
    } catch (error) {
      console.error('Error loading system roles:', error)
      // Return fallback data on any error
      return [
        { role_id: 1, role_name: 'Data Collector', description: 'Field data collection and entry', is_default: true, is_system: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
        { role_id: 2, role_name: 'Researcher', description: 'Research and analysis activities', is_default: false, is_system: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
        { role_id: 3, role_name: 'Viewer', description: 'Read-only access to data', is_default: false, is_system: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() }
      ]
    }
  },

  async getFirstSystemRole(): Promise<Role | null> {
    try {
      const { data, error } = await supabaseAdmin
        .from('role')
        .select('*')
        .eq('is_system', true)
        .order('role_id')
        .limit(1)
        .single()
      
      if (error) {
        console.error('Error loading first system role:', error)
        throw error
      }
      return data
    } catch (error) {
      console.error('Error loading first system role:', error)
      throw error
    }
  },

  async getAllSites(): Promise<Site[]> {
    try {
      console.log('Fetching sites from database...')
      const { data, error } = await supabaseAdmin
        .from('site')
        .select('*')
        .order('name')
      
      if (error) {
        console.error('Error loading sites:', error)
        // Return fallback data if there's an error
        return [
          { site_id: 1, name: 'Korogacho', country_id: 1, description: 'Nairobi slum area', location_name: 'Nairobi', latitude: -1.2921, longitude: 36.8219, address: 'Korogacho, Nairobi', start_date: '2023-01-01', end_date: undefined, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
          { site_id: 2, name: 'Kibera', country_id: 1, description: 'Largest slum in Nairobi', location_name: 'Nairobi', latitude: -1.3131, longitude: 36.7897, address: 'Kibera, Nairobi', start_date: '2023-01-01', end_date: undefined, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
          { site_id: 3, name: 'Mathare', country_id: 1, description: 'Nairobi informal settlement', location_name: 'Nairobi', latitude: -1.2667, longitude: 36.8333, address: 'Mathare, Nairobi', start_date: '2023-01-01', end_date: undefined, created_at: new Date().toISOString(), updated_at: new Date().toISOString() }
        ]
      }
      console.log('Successfully loaded sites:', data)
      return data || []
    } catch (error) {
      console.error('Error loading sites:', error)
      // Return fallback data on any error
      return [
        { site_id: 1, name: 'Korogacho', country_id: 1, description: 'Nairobi slum area', location_name: 'Nairobi', latitude: -1.2921, longitude: 36.8219, address: 'Korogacho, Nairobi', start_date: '2023-01-01', end_date: undefined, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
        { site_id: 2, name: 'Kibera', country_id: 1, description: 'Largest slum in Nairobi', location_name: 'Nairobi', latitude: -1.3131, longitude: 36.7897, address: 'Kibera, Nairobi', start_date: '2023-01-01', end_date: undefined, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
        { site_id: 3, name: 'Mathare', country_id: 1, description: 'Nairobi informal settlement', location_name: 'Nairobi', latitude: -1.2667, longitude: 36.8333, address: 'Mathare, Nairobi', start_date: '2023-01-01', end_date: undefined, created_at: new Date().toISOString(), updated_at: new Date().toISOString() }
      ]
    }
  },

  async createUserWithSystemRole(userData: {
    email: string
    password: string
    full_name: string
    phone_number?: string
  }): Promise<any> {
    try {
      // First, get the first system role
      const systemRole = await this.getFirstSystemRole()
      if (!systemRole) {
        throw new Error('No system role found')
      }

      // Create the auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
        options: {
          data: {
            full_name: userData.full_name,
            phone_number: userData.phone_number
          }
        }
      })

      if (authError) {
        throw authError
      }

      if (authData.user) {
        // Create the user profile with the system role
        const { data: profileData, error: profileError } = await supabaseAdmin
          .from('user_profile')
          .insert({
            auth_user_id: authData.user.id,
            email: userData.email,
            full_name: userData.full_name,
            phone_number: userData.phone_number,
            role_id: systemRole.role_id,
            status: 'active'
          })
          .select()
          .single()

        if (profileError) {
          // If profile creation fails, we should clean up the auth user
          console.error('Error creating user profile:', profileError)
          throw profileError
        }

        return { authData, profileData }
      }

      throw new Error('Failed to create user')
    } catch (error) {
      console.error('Error creating user with public role:', error)
      throw error
    }
  }
} 