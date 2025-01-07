import NextAuth from "next-auth";
import { authConfig } from "./auth.config";
import { SessionWithRole, UserWithRole } from "./types/auth";

export const { handlers, signIn, signOut, auth } = NextAuth(authConfig);

declare module "next-auth" {
  interface Session extends SessionWithRole {
    user: UserWithRole;
  }
  interface User extends UserWithRole {
    role: string;
  }
}
