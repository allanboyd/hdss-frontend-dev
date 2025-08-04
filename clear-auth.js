// Clear Authentication State Script
// Run this in your browser console to clear auth tokens

console.log('Clearing authentication state...')

// Clear localStorage
localStorage.removeItem('supabase.auth.token')
localStorage.removeItem('supabase.auth.refreshToken')
localStorage.removeItem('supabase.auth.expiresAt')
localStorage.removeItem('supabase.auth.expiresIn')
localStorage.removeItem('supabase.auth.accessToken')
localStorage.removeItem('supabase.auth.refreshToken')
localStorage.removeItem('supabase.auth.user')
localStorage.removeItem('supabase.auth.session')

// Clear sessionStorage
sessionStorage.removeItem('supabase.auth.token')
sessionStorage.removeItem('supabase.auth.refreshToken')
sessionStorage.removeItem('supabase.auth.expiresAt')
sessionStorage.removeItem('supabase.auth.expiresIn')
sessionStorage.removeItem('supabase.auth.accessToken')
sessionStorage.removeItem('supabase.auth.refreshToken')
sessionStorage.removeItem('supabase.auth.user')
sessionStorage.removeItem('supabase.auth.session')

// Clear all Supabase related items
Object.keys(localStorage).forEach(key => {
  if (key.includes('supabase')) {
    localStorage.removeItem(key)
  }
})

Object.keys(sessionStorage).forEach(key => {
  if (key.includes('supabase')) {
    sessionStorage.removeItem(key)
  }
})

console.log('Authentication state cleared. Please refresh the page and log in again.') 