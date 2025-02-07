'use client'

import React from 'react'

export interface RegisterFormProps {
  applicationId: string
  apiUrl: string
  onSubmit?: (email: string, password: string, username: string) => Promise<void>
  onSuccess?: () => void
  onError?: (error: string) => void
  render: (props: {
    email: string
    setEmail: (email: string) => void
    password: string
    setPassword: (password: string) => void
    username: string
    setUsername: (username: string) => void
    error: string
    isLoading: boolean
    handleSubmit: (e: React.FormEvent) => Promise<void>
  }) => React.ReactNode
}

export function RegisterForm({
  applicationId,
  apiUrl,
  onSubmit,
  onSuccess,
  onError,
  render
}: RegisterFormProps) {
  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [username, setUsername] = React.useState('')
  const [error, setError] = React.useState('')
  const [isLoading, setIsLoading] = React.useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      if (onSubmit) {
        await onSubmit(email, password, username)
      } else {
        const response = await fetch(`${apiUrl}/api/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password, username, application_id: applicationId }),
        })

        const data = await response.json()

        if (response.ok) {
          onSuccess && onSuccess()
        } else {
          throw new Error(data.error || 'Registration failed')
        }
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred. Please try again.'
      setError(errorMessage)
      onError && onError(errorMessage)
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
        username,
        setUsername,
        error,
        isLoading,
        handleSubmit
      })}
    </>
  )
}

