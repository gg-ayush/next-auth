import { UserRole } from "@prisma/client";
import { DefaultSession } from "next-auth";
export type ExtendedUser = DefaultSession["user"] & {
  gg_id: string;
  username?: string | null;
  email?: string | null;
  role: UserRole;
  isTwoFactorEnabled: boolean;
  isOAuth: boolean;
};

declare module "next/server" {
  interface NextRequest {
    auth?: {
      user?: {
        role?: UserRole
        gg_id?: string
      } & DefaultSession["user"]
    } | null
  }
}

declare module "next-auth" {
  interface Session {
    user: ExtendedUser;
  }
}

declare module "next-auth/jwt" {
  interface JWT  extends ExtendedUser {}
}

declare module "next-auth/providers/github" {
  interface GithubProfile {
    id: number;
    login: string;
    email: string;
    avatar_url: string;
  }
}

declare module "next-auth/providers/google" {
  interface GoogleProfile {
    sub: string;
    email: string;
    email_verified: boolean;
    name: string;
    picture: string;
  }
}