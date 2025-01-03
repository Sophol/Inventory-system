import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";

import { IAccountDoc } from "./database/account.model";
import { IUserDoc } from "./database/user.model";
import { api } from "./lib/api";
import { SignInSchema } from "./lib/validations";
import bcrypt from "bcryptjs";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    GitHub,
    Google,
    Credentials({
      async authorize(credentials) {
        const validatedFields = SignInSchema.safeParse(credentials);
        if (validatedFields.success) {
          const { email, password } = validatedFields.data;
          const { data: existingAccount } = (await api.accounts.getByProvider(
            email
          )) as ActionResponse<IAccountDoc>;
          if (!existingAccount) return null;
          const { data: existingUser } = (await api.users.getById(
            existingAccount.userId.toString()
          )) as ActionResponse<IUserDoc>;
          if (!existingUser) return null;
          const isValidPassword = await bcrypt.compare(
            password,
            existingAccount.password!
          );

          if (isValidPassword) {
            return {
              id: existingUser._id,
              name: existingUser.name,
              email: existingUser.email,
              image: existingUser.image,
              role: existingUser.role,
            };
          }
        }
        return null;
      },
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      session.user.id = token.sub as string;
      session.user.role = token.role as string; // Add role to session
      return session;
    },
    async jwt({ token, user, account, trigger }) {
      if (trigger === "signIn" || trigger === "signUp") {
        if (user) {
          token.id = user.id;
          token.role = user.role;
        } else if (account) {
          // Handle OAuth sign-in
          const { data: existingAccount, success } =
            (await api.accounts.getByProvider(
              account.provider === "credentials"
                ? token.email!
                : account.providerAccountId
            )) as ActionResponse<IAccountDoc>;

          if (success && existingAccount) {
            const { data: existingUser } = (await api.users.getById(
              existingAccount.userId.toString()
            )) as ActionResponse<IUserDoc>;

            if (existingUser) {
              token.id = existingUser._id;
              token.role = existingUser.role;
            }
          }
        }
      } else if (!token.role) {
        const { data: existingUser } = token.sub
          ? ((await api.users.getById(token.sub)) as ActionResponse<IUserDoc>)
          : { data: null };
        if (existingUser) {
          token.id = existingUser._id;
          token.role = existingUser.role;
        }
      }
      return token;
    },
    async signIn({ user, profile, account }) {
      if (account?.type === "credentials") return true;
      if (!account || !user) return false;

      const userInfo = {
        name: user.name!,
        email: user.email!,
        image: user.image!,
        username:
          account.provider === "github"
            ? (profile?.login as string)
            : (user.name?.toLowerCase() as string),
      };

      const { success } = (await api.auth.oAuthSignIn({
        user: userInfo,
        provider: account.provider as "github" | "google",
        providerAccountId: account.providerAccountId,
      })) as ActionResponse;

      if (!success) return false;

      return true;
    },
  },
});
