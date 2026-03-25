import React, { createContext, useEffect, useState } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import type { User } from 'firebase/auth'
import { auth } from '@/lib/firebase'
import { bootstrapUserProfile } from './authService'

export interface AuthContextValue {
  user: User | null
  loading: boolean
}

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      void (async () => {
        if (firebaseUser) {
          try {
            await bootstrapUserProfile(firebaseUser)
          } catch (err) {
            // Profile bootstrap failure is non-fatal — auth still proceeds
            console.error('[AuthProvider] bootstrapUserProfile failed:', err)
          }
        }
        setUser(firebaseUser)
        setLoading(false)
      })()
    })
    return unsubscribe
  }, [])

  return <AuthContext.Provider value={{ user, loading }}>{children}</AuthContext.Provider>
}
