"use server";
import action from "../handlers/action";
import handleError from "../handlers/error";
import { SignInSchema, SignUpSchema } from "../validations";
import mongoose from "mongoose";
import User from "@/database/user.model";
import bcrypt from "bcryptjs";
import Account from "@/database/account.model";
import { signIn } from "@/auth";
import { NotFoundError } from "../http-errors";

export async function signUpWithCredentials(
  params: AuthCredentials
): Promise<ActionResponse> {
  const validationResutl = await action({ params, schema: SignUpSchema });
  if (validationResutl instanceof Error) {
    return handleError(validationResutl) as ErrorResponse;
  }
  const { name, username, email, password } = validationResutl.params!;
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const existingUser = await User.findOne({ email }).session(session);
    if (existingUser) {
      throw new Error("User already exists");
    }
    const existingUsername = await User.findOne({ username }).session(session);
    if (existingUsername) {
      throw new Error("User already exists");
    }
    const hashPassword = await bcrypt.hash(password, 12);
    const [newUser] = await User.create([{ name, username, email }], {
      session,
    });
    await Account.create(
      [
        {
          userId: newUser._id,
          name,
          provider: "credentials",
          providerAccountId: email,
          password: hashPassword,
        },
      ],
      { session }
    );
    await session.commitTransaction();
    await signIn("credentials", { email, password, redirect: false });
    return { success: true, status: 201 };
  } catch (error) {
    await session.abortTransaction();
    return handleError(error) as ErrorResponse;
  } finally {
    session.endSession();
  }
}

export async function signInWithCredentials(
  params: Pick<AuthCredentials, "email" | "password">
): Promise<ActionResponse> {
  const validationResutl = await action({ params, schema: SignInSchema });
  if (validationResutl instanceof Error) {
    return handleError(validationResutl) as ErrorResponse;
  }
  const { email, password } = validationResutl.params!;

  try {
    const existingUser = await User.findOne({
      $or: [{ email }, { username: email }],
    });
    if (!existingUser) {
      throw new NotFoundError("User");
    }
    const existingAccount = await Account.findOne({
      provider: "credentials",
      providerAccountId: existingUser.email,
    });
    if (!existingAccount) {
      throw new NotFoundError("Account");
    }
    const passwordMatch = await bcrypt.compare(
      password,
      existingAccount.password!
    );
    if (!passwordMatch) throw new Error("Password does not match");
    await signIn("credentials", {
      email: existingUser.email,
      password,
      redirect: false,
    });
    return { success: true };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}
