/* eslint-disable react/no-unescaped-entities */
import { getApplicationApiKeys } from "@/services/api-keys"
import { ApiKeyDisplay } from "@/_components/application/api-key-display"
import { IntegrationGuide } from "@/_components/application/integration-guide"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/ui/tabs"

export default async function ConfigurePage({ params }: { params: { applicationId: string } }) {
  const { success, data: apiKeys, error } = await getApplicationApiKeys(params.applicationId)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Configure</h1>
        <p className="text-sm text-muted-foreground">
          Manage your application's authentication settings and integration
        </p>
      </div>

      <Tabs defaultValue="keys" className="space-y-6">
        <TabsList>
          <TabsTrigger value="keys">API Keys</TabsTrigger>
          <TabsTrigger value="guide">Integration Guide</TabsTrigger>
        </TabsList>

        <TabsContent value="keys" className="space-y-4">
          <div className="rounded-lg border p-4">
            <h2 className="text-lg font-semibold mb-4">API Keys</h2>
            {success && apiKeys ? (
              <ApiKeyDisplay initialApiKeys={apiKeys} applicationId={params.applicationId} />
            ) : (
              <p>{error || "No API keys found. Generate your first API key to get started."}</p>
            )}
          </div>
        </TabsContent>

        <TabsContent value="guide">
          <IntegrationGuide applicationId={params.applicationId} />
        </TabsContent>
      </Tabs>
    </div>
  )
}

