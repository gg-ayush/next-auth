export interface ApiResponse<T = any> {
    data?: T;
    error?: string;
    status: number;
    applicationId?: string;
    developerId?: string;
  }
  
  export interface AuthResponse {
    user: {
      gg_id: string;
      username: string;
      email: string;
      role: string;
    };
    token: string;
  }
  
  