import { DefaultSession, DefaultUser } from "next-auth";
import { JWT } from "next-auth/jwt";

export interface UserWithRole extends DefaultUser {
  role: string;
  id: string;
  name: string;
  email: string;
  username: string;
  image?: string;
}

export interface SessionWithRole extends DefaultSession {
  user: {
    id: string;
    role?: string;
  } & DefaultSession["user"];
}

export interface JWTWithRole extends JWT {
  role?: string;
}

export interface OAuthSignInParams {
  user: {
    name: string;
    email: string;
    image: string;
    username: string;
  };
  provider: "github" | "google";
  providerAccountId: string;
}
