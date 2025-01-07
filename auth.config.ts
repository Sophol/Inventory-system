import { NextAuthConfig } from "next-auth";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { SignInSchema } from "./lib/validations";
import { api } from "./lib/api";
import { JWTWithRole, SessionWithRole, UserWithRole } from "./types/auth";
import { IAccountDoc } from "./database/account.model";
import { IUserDoc } from "./database/user.model";

export const authConfig: NextAuthConfig = {
  providers: [
    GitHub,
    Google,
    Credentials({
      async authorize(credentials) {
        const validatedFields = SignInSchema.safeParse(credentials);

        if (!validatedFields.success) {
          return null;
        }

        const { email, password } = validatedFields.data;

        try {
          const { data: existingAccount } = (await api.accounts.getByProvider(
            email
          )) as ActionResponse<IAccountDoc>;

          if (!existingAccount || !existingAccount.password) {
            return null;
          }

          const { data: existingUser } = (await api.users.getById(
            existingAccount.userId.toString()
          )) as ActionResponse<User>;

          if (!existingUser) {
            return null;
          }

          const isValidPassword = await bcrypt.compare(
            password,
            existingAccount.password
          );

          if (!isValidPassword) {
            return null;
          }

          return {
            _id: existingUser._id,
            username: existingUser.username,
            password: existingUser.password,
            role: existingUser.role,
            id: existingUser._id.toString(),
            name: existingUser.name,
            email: existingUser.email,
            image: existingUser.image,
            isStaff: existingUser.isStaff,
            branch: existingUser.branch,
            status: existingUser.status,
          } as User;
        } catch (error) {
          console.error("Auth error:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async session({ session, token }): Promise<SessionWithRole> {
      return {
        ...session,
        user: {
          ...session.user,
          id: token.sub as string,
          role: typeof token.role === "string" ? token.role : "",
        },
      };
    },
    async jwt({ token, user, account, trigger }): Promise<JWTWithRole> {
      if (trigger === "signIn" || trigger === "signUp") {
        if (user) {
          token.id = user.id;
          token.role = (user as UserWithRole).role;
        } else if (account) {
          try {
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
          } catch (error) {
            console.error("JWT error:", error);
          }
        }
      } else if (!token.role) {
        try {
          const { data: existingUser } = token.sub
            ? ((await api.users.getById(token.sub)) as ActionResponse<IUserDoc>)
            : { data: null };

          if (existingUser) {
            token.id = existingUser._id;
            token.role = existingUser.role;
          }
        } catch (error) {
          console.error("JWT refresh error:", error);
        }
      }
      return token;
    },
    async signIn({ user, profile, account }) {
      if (account?.type === "credentials") {
        return true;
      }

      if (!account || !user) {
        return false;
      }

      try {
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

        return success;
      } catch (error) {
        console.error("OAuth sign-in error:", error);
        return false;
      }
    },
  },
};
