/* eslint-disable react/no-unescaped-entities */
"use client"

import { useState } from "react"
import { Button } from "@/ui/button"
import { Input } from "@/ui/input"
import { Copy, Eye, EyeOff, RefreshCw } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/ui/alert"
import { toast } from "@/layout/base/toast/use-toast"
import { generateNewApiKey } from "@/services/api-keys"

interface ApiKey {
  id: string
  public_key: string
  last_used?: Date | null
  created_at: Date
}

interface ApiKeyDisplayProps {
  initialApiKeys: ApiKey[]
  applicationId: string
}

export function ApiKeyDisplay({ initialApiKeys, applicationId }: ApiKeyDisplayProps) {
  const [apiKeys, setApiKeys] = useState(initialApiKeys)
  const [showSecret, setShowSecret] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [newSecretKey, setNewSecretKey] = useState<string | null>(null)

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: "Copied!",
      description: "API key copied to clipboard",
    })
  }

  const generateNewKey = async () => {
    setIsGenerating(true)
    try {
      const result = await generateNewApiKey(applicationId)
      if (result.success) {
        setApiKeys([...apiKeys, result.data])
        setNewSecretKey(result.data.secret_key)
        toast({
          title: "Success",
          description: "New API key generated",
        })
      } else {
        throw new Error(result.error)
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate new API key",
        variant: "destructive",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="space-y-4">
      {apiKeys.map((key) => (
        <div key={key.id} className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="flex-1 space-y-2">
              <label className="text-sm font-medium">Public Key</label>
              <div className="flex items-center gap-2">
                <Input readOnly value={key.public_key} className="font-mono" />
                <Button variant="ghost" size="icon" onClick={() => copyToClipboard(key.public_key)}>
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {newSecretKey && key.id === apiKeys[apiKeys.length - 1].id && (
            <div className="flex items-center gap-4">
              <div className="flex-1 space-y-2">
                <label className="text-sm font-medium">Secret Key (Only shown once)</label>
                <div className="flex items-center gap-2">
                  <Input type={showSecret ? "text" : "password"} value={newSecretKey} className="font-mono" readOnly />
                  <Button variant="ghost" size="icon" onClick={() => setShowSecret(!showSecret)}>
                    {showSecret ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => copyToClipboard(newSecretKey)}>
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          )}

          <div className="text-sm text-muted-foreground">
            Created: {new Date(key.created_at).toLocaleDateString()}
            {key.last_used && ` • Last used: ${new Date(key.last_used).toLocaleDateString()}`}
          </div>
        </div>
      ))}

      <Alert>
        <AlertTitle>Important</AlertTitle>
        <AlertDescription>
          Your secret key is only shown once when generated. Make sure to store it securely. If you lose your secret
          key, you'll need to generate a new one.
        </AlertDescription>
      </Alert>

      <Button onClick={generateNewKey} disabled={isGenerating} className="w-full">
        {isGenerating ? (
          <>
            <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
            Generating...
          </>
        ) : (
          "Generate New API Key"
        )}
      </Button>
    </div>
  )
}

