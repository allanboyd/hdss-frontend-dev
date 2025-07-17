'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { User } from '@supabase/supabase-js'
import { auth } from './supabase'

interface AuthContextType {
  user: User | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ data: unknown; error: unknown }>
  signUp: (email: string, password: string) => Promise<{ data: unknown; error: unknown }>
  signOut: () => Promise<{ error: unknown }>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get initial user
    const getInitialUser = async () => {
      const { user } = await auth.getCurrentUser()
      setUser(user)
      setLoading(false)
    }

    getInitialUser()

    // Listen for auth changes
    const { data: { subscription } } = auth.onAuthStateChange((event, session) => {
      if (session && typeof session === 'object' && 'user' in session) {
        setUser(session.user as User | null)
      } else {
        setUser(null)
      }
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const value = {
    user,
    loading,
    signIn: auth.signIn,
    signUp: auth.signUp,
    signOut: auth.signOut,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
} 