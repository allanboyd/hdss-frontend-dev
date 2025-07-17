import { User } from '@supabase/supabase-js'

export interface AuthUser extends User {
  // Add any additional user properties here
}

export interface AuthState {
  user: AuthUser | null
  loading: boolean
  error: string | null
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface SignUpCredentials extends LoginCredentials {
  confirmPassword: string
}

export interface AuthResponse {
  data: any
  error: any
} 