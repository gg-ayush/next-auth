'use client'

import { createContext, useContext, useEffect, useState } from 'react'

interface SessionContextType {
  user: any | null
  loading: boolean
}

const SessionContext = createContext<SessionContextType>({ user: null, loading: true })

export const useSession = () => useContext(SessionContext)

interface SessionProviderProps {
  children: React.ReactNode
  apiUrl: string
}

export function SessionProvider({ children, apiUrl }: SessionProviderProps) {
  const [user, setUser] = useState<any | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadUserFromSession() {
      try {
        const response = await fetch(`${apiUrl}/api/user`, {
          credentials: 'include',
        })
        if (response.ok) {
          const userData = await response.json()
          setUser(userData)
        }
      } catch (error) {
        console.error('Failed to load user session:', error)
      } finally {
        setLoading(false)
      }
    }

    loadUserFromSession()
  }, [apiUrl])

  return (
    <SessionContext.Provider value={{ user, loading }}>
      {children}
    </SessionContext.Provider>
  )
}

