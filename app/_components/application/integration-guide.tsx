"use client"

import { useState } from "react"
import { Button } from "@/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/ui/tabs"
import { Copy } from "lucide-react"
import { toast } from "@/layout/base/toast/use-toast"

interface IntegrationGuideProps {
  applicationId: string
}

export function IntegrationGuide({ applicationId }: IntegrationGuideProps) {
  const [activeTab, setActiveTab] = useState("javascript")

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code)
    toast({
      title: "Copied!",
      description: "Code snippet copied to clipboard",
    })
  }

  const javascriptExample = `
// Initialize the auth client
const auth = new AuthClient({
  applicationId: '${applicationId}',
  publicKey: 'YOUR_PUBLIC_KEY',
  secretKey: 'YOUR_SECRET_KEY'
});

// Register a new user
const register = async (userData) => {
  try {
    const response = await auth.register({
      email: userData.email,
      password: userData.password,
      username: userData.username,
      phone_number: userData.phone_number
    });
    return response.data;
  } catch (error) {
    console.error('Registration failed:', error);
  }
};

// Login a user
const login = async (credentials) => {
  try {
    const response = await auth.login({
      email: credentials.email,
      password: credentials.password
    });
    return response.data;
  } catch (error) {
    console.error('Login failed:', error);
  }
};
`.trim()

  return (
    <div className="space-y-6">
      <div className="rounded-lg border p-6">
        <h2 className="text-lg font-semibold mb-4">Integration Steps</h2>
        <ol className="list-decimal list-inside space-y-4">
          <li>
            Get your API keys from the <strong>API Keys</strong> tab
          </li>
          <li>
            Install our client library:
            <div className="mt-2 relative">
              <pre className="bg-secondary p-4 rounded-lg">npm install @your-org/auth-client</pre>
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2"
                onClick={() => copyCode("npm install @your-org/auth-client")}
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </li>
          <li>
            Initialize the client with your API keys and implement authentication:
            <div className="mt-2">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList>
                  <TabsTrigger value="javascript">JavaScript</TabsTrigger>
                  <TabsTrigger value="python">Python</TabsTrigger>
                </TabsList>
                <TabsContent value="javascript" className="relative mt-4">
                  <pre className="bg-secondary p-4 rounded-lg overflow-x-auto">{javascriptExample}</pre>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2"
                    onClick={() => copyCode(javascriptExample)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </TabsContent>
                <TabsContent value="python" className="relative mt-4">
                  <pre className="bg-secondary p-4 rounded-lg"># Python implementation coming soon</pre>
                </TabsContent>
              </Tabs>
            </div>
          </li>
        </ol>
      </div>

      <div className="rounded-lg border p-6">
        <h2 className="text-lg font-semibold mb-4">API Reference</h2>
        <div className="space-y-4">
          <div>
            <h3 className="font-medium">Authentication Endpoints</h3>
            <p className="text-sm text-muted-foreground mt-1">Base URL: https://api.yourservice.com</p>
          </div>
          <div className="space-y-2">
            <p className="font-medium">POST /auth/register</p>
            <p className="text-sm text-muted-foreground">Register a new user in your application</p>
          </div>
          <div className="space-y-2">
            <p className="font-medium">POST /auth/login</p>
            <p className="text-sm text-muted-foreground">Authenticate a user and receive a session token</p>
          </div>
        </div>
      </div>
    </div>
  )
}

