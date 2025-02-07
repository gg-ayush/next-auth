import React from 'react'
import { AuthError } from '../types'

export interface LoginFormProps {
  applicationId: string
  apiUrl: string
  onSubmit?: (email: string, password: string) => Promise<void>
  onSuccess?: () => void
  onError?: (error: AuthError) => void
  render: (props: {
    email: string
    setEmail: (email: string) => void
    password: string
    setPassword: (password: string) => void
    error: AuthError | null
    isLoading: boolean
    handleSubmit: (e: React.FormEvent) => Promise<void>
  }) => React.ReactNode
}

export function LoginForm({
  applicationId,
  apiUrl,
  onSubmit,
  onSuccess,
  onError,
  render
}: LoginFormProps) {
  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [error, setError] = React.useState<AuthError | null>(null)
  const [isLoading, setIsLoading] = React.useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    try {
      if (onSubmit) {
        await onSubmit(email, password)
      } else {
        const response = await fetch(`${apiUrl}/api/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password, application_id: applicationId }),
        })

        const data = await response.json()

        if (response.ok) {
          onSuccess && onSuccess()
        } else {
          throw new Error(data.error || 'Login failed')
        }
      }
    } catch (err) {
      const authError: AuthError = {
        message: err instanceof Error ? err.message : 'An error occurred. Please try again.',
      }
      setError(authError)
      onError && onError(authError)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      {render({
        email,
        setEmail,
        password,
        setPassword,
        error,
        isLoading,
        handleSubmit
      })}
    </>
  )
}