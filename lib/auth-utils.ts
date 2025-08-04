import { supabase } from './supabase'

export const handleAuthError = async (error: unknown) => {
  console.error('Auth error:', error)
  
  // Handle refresh token errors
  if (error && typeof error === 'object' && 'message' in error && 
      typeof error.message === 'string' && 
      (error.message.includes('Invalid Refresh Token') || 
       error.message.includes('Refresh Token Not Found') ||
       error.message.includes('JWT expired'))) {
    
    console.log('Handling refresh token error, signing out user')
    
    try {
      await supabase.auth.signOut()
      // Clear any stored auth data
      if (typeof window !== 'undefined') {
        localStorage.removeItem('supabase.auth.token')
        sessionStorage.removeItem('supabase.auth.token')
      }
    } catch (signOutError) {
      console.error('Error during sign out:', signOutError)
    }
    
    return {
      shouldRedirect: true,
      redirectTo: '/login'
    }
  }
  
  return {
    shouldRedirect: false,
    redirectTo: null
  }
}

export const clearAuthData = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('supabase.auth.token')
    sessionStorage.removeItem('supabase.auth.token')
  }
}

export const isAuthError = (error: unknown) => {
  return error && typeof error === 'object' && 'message' in error && 
         typeof error.message === 'string' &&
         (error.message.includes('Invalid Refresh Token') ||
          error.message.includes('Refresh Token Not Found') ||
          error.message.includes('JWT expired') ||
          error.message.includes('Invalid JWT'))
} 