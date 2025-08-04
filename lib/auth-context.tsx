'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { supabase } from './supabase'
import { HydrationSafe } from '@/components/ui/hydration-safe'

interface AuthContextType {
  user: User | null
  session: Session | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ data: unknown; error: unknown }>
  signUp: (email: string, password: string) => Promise<{ data: unknown; error: unknown }>
  signOut: () => Promise<{ error: unknown }>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return

    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession()
        if (error) {
          console.error('Error getting initial session:', error)
          // If there's a refresh token error, clear the session
          if (error.message.includes('Invalid Refresh Token') || error.message.includes('Refresh Token Not Found')) {
            await supabase.auth.signOut()
            setUser(null)
            setSession(null)
          }
        } else {
          setSession(session)
          setUser(session?.user ?? null)
        }
      } catch (error) {
        console.error('Error in getInitialSession:', error)
        setUser(null)
        setSession(null)
      } finally {
        setLoading(false)
      }
    }

    getInitialSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, session?.user?.email)
      
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        setSession(session)
        setUser(session?.user ?? null)
      } else if (event === 'SIGNED_OUT') {
        setSession(null)
        setUser(null)
      }
      
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [mounted])

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      return { data, error }
    } catch (error) {
      console.error('Sign in error:', error)
      return { data: null, error }
    }
  }

  const signUp = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      })
      return { data, error }
    } catch (error) {
      console.error('Sign up error:', error)
      return { data: null, error }
    }
  }

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      return { error }
    } catch (error) {
      console.error('Sign out error:', error)
      return { error }
    }
  }

  const value = {
    user,
    session,
    loading,
    signIn,
    signUp,
    signOut,
  }

  return (
    <HydrationSafe fallback={<div>Loading...</div>}>
      <AuthContext.Provider value={value}>
        {children}
      </AuthContext.Provider>
    </HydrationSafe>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
} 