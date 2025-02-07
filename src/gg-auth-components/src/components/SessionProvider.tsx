import React, { createContext, useContext, useEffect, useState } from 'react'
import { User } from '../types'

interface SessionContextType {
  user: User | null
  loading: boolean
  logout: () => Promise<void>
}

const SessionContext = createContext<SessionContextType>({
  user: null,
  loading: true,
  logout: async () => {},
})

export const useSession = () => useContext(SessionContext)

interface SessionProviderProps {
  children: React.ReactNode
  apiUrl: string
}

export function SessionProvider({ children, apiUrl }: SessionProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadUserFromSession() {
      try {
        const response = await fetch(`${apiUrl}/api/user`, {
          credentials: 'include',
        })
        if (response.ok) {
          const userData: User = await response.json()
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

  const logout = async () => {
    try {
      const response = await fetch(`${apiUrl}/api/logout`, {
        method: 'POST',
        credentials: 'include',
      })
      if (response.ok) {
        setUser(null)
      } else {
        throw new Error('Logout failed')
      }
    } catch (error) {
      console.error('Failed to logout:', error)
    }
  }

  return (
    <SessionContext.Provider value={{ user, loading, logout }}>
      {children}
    </SessionContext.Provider>
  )
}