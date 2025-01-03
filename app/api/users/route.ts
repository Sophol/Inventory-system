import mongoose from "mongoose";
import { NextResponse } from "next/server";
import slugify from "slugify";
import bcrypt from "bcryptjs";

import User from "@/database/user.model";
import handleError from "@/lib/handlers/error";
import { ValidationError } from "@/lib/http-errors";
import dbConnect from "@/lib/mongoose";
import { UserSchema } from "@/lib/validations";
import { Account } from "@/database";

export async function GET() {
  try {
    await dbConnect();
    const users = await User.find();
    return NextResponse.json({ success: true, data: users }, { status: 200 });
  } catch (error) {
    return handleError(error, "api") as APIErrorResponse;
  }
}
export async function POST(request: Request) {
  await dbConnect();
  const session = await mongoose.startSession();
  session.startTransaction();
  const body = await request.json();
  try {
    const validateData = UserSchema.safeParse(body);
    if (!validateData.success) {
      throw new ValidationError(validateData.error.flatten().fieldErrors);
    }
    const {
      email,
      username,
      password,
      name,
      image,
      branch,
      salary,
      role,
      phone,
      isStaff,
    } = validateData.data;
    const slugifiedUsername = slugify(username, {
      lower: true,
      strict: true,
      trim: true,
    });
    const existingEmail = await User.findOne({ email }).session(session);
    if (existingEmail) throw new Error("Email already exist");
    const existingUsername = await User.findOne({
      username: slugifiedUsername,
    }).session(session);
    if (existingUsername) throw new Error("Username already exist");
    const [newUser] = await User.create(
      [
        {
          name,
          username: slugifiedUsername,
          email,
          image,
          branch,
          salary,
          role,
          phone,
          isStaff,
        },
      ],
      { session }
    );
    console.log("newUser", newUser);
    const hashPassword = await bcrypt.hash(password, 12);
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
    return NextResponse.json({ success: true, data: newUser }, { status: 201 });
  } catch (error: unknown) {
    await session.abortTransaction();
    return handleError(error, "api") as APIErrorResponse;
  } finally {
    session.endSession();
  }
}
