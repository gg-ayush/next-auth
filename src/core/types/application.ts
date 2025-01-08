export type ApplicationApiKey = {
    id: string;
    application_id: string;
    public_key: string;
    hashed_secret: string;
    created_at: Date;
    last_used: Date;
  };
  
  export type Application = {
    id: string;
    name: string;
    description: string | null;
    developer_id: string;
    created_at: Date;
    updated_at: Date;
    ApplicationApiKey: ApplicationApiKey[];
  };
  
  