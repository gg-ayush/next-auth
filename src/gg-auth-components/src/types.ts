export interface User {
    id: string
    email: string | null
    username: string | null
    phone_number: string | null
    lastSignedIn?: string | null
    joined: string
}
  
export interface AuthError {
    message: string;
    code?: string;
}