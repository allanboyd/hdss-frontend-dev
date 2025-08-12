// User Management Types

export interface Role {
  role_id: number;
  role_name: string;
  description?: string;
  is_default: boolean;
  is_system: boolean;
  created_at: string;
  updated_at: string;
}

export interface UserProfile {
  user_id: number;
  auth_user_id: string;
  username?: string;
  email: string;
  full_name: string;
  phone_number?: string;
  role_id: number;
  site_id?: number;
  status: 'active' | 'inactive' | 'suspended';
  created_at: string;
  updated_at: string;
  role?: Role;
  site?: Site;
}

export interface SiteUser {
  site_user_id: number;
  site_id: number;
  role_id: number;
  user_profile_id: number;
  status: 'active' | 'inactive' | 'suspended';
  created_at: string;
  updated_at: string;
  site?: Site;
  role?: Role;
  user_profile?: UserProfile;
}

export interface UserAccountRequest {
  request_id: number;
  email: string;
  full_name: string;
  phone_number?: string;
  requested_role_id?: number;
  requested_site_id?: number;
  reason?: string;
  status: 'pending' | 'approved' | 'rejected';
  reviewed_by?: number;
  reviewed_at?: string;
  created_at: string;
  updated_at: string;
  requested_role?: Role;
  requested_site?: Site;
  reviewer?: UserProfile;
}

// Form types for creating/updating entities
export interface CreateRoleForm {
  role_name: string;
  description?: string;
  is_default: boolean;
  is_system: boolean;
}

export interface CreateUserProfileForm {
  username?: string;
  email: string;
  full_name: string;
  phone_number?: string;
  role_id: number;
  site_id?: number | undefined;
  status: 'active' | 'inactive' | 'suspended';
  password: string; // For auth user creation
}

export interface CreateSiteUserForm {
  site_id: number;
  role_id: number;
  user_profile_id: number;
  status: 'active' | 'inactive' | 'suspended';
}

export interface CreateUserAccountRequestForm {
  email: string;
  full_name: string;
  phone_number?: string;
  requested_role_id?: number;
  requested_site_id?: number;
  reason?: string;
}

export interface UpdateUserAccountRequestForm {
  status: 'pending' | 'approved' | 'rejected';
  reviewed_by: number;
}

// User management counts view interface
export interface UserManagementCounts {
  roles_count: number;
  users_count: number;
  pending_requests_count: number;
  total_requests_count: number;
  last_updated: string;
}

// Import site types for relationships
import { Site } from './site-management';
