import mongoose from "mongoose";
import slugify from "slugify";

import User from "@/database/user.model";
import handleError from "@/lib/handlers/error";
import { NotFoundError, ValidationError } from "@/lib/http-errors";
import dbConnect from "@/lib/mongoose";
import { UserSchema } from "@/lib/validations";
import { NextResponse } from "next/server";
import { Account } from "@/database";
import bcrypt from "bcryptjs";

export async function GET(
  _: Request,
  { params }: { params: Promise<{ id: string }> }
): Promise<APIResponse<User>> {
  const { id } = await params;
  if (!id) throw new NotFoundError("User");
  try {
    await dbConnect();

    const user = await User.findById(id).populate("branch", "title");
    if (!user) throw new NotFoundError("User");
    return NextResponse.json({ success: true, data: user }, { status: 200 });
  } catch (error) {
    return handleError(error, "api") as APIErrorResponse;
  }
}
export async function DELETE(
  _: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  if (!id) throw new NotFoundError("User");
  try {
    await dbConnect();

    const user = await User.findByIdAndDelete(id);
    if (!user) throw new NotFoundError("User");
    return NextResponse.json({ success: true, data: user }, { status: 204 });
  } catch (error) {
    return handleError(error, "api") as APIErrorResponse;
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  if (!id) throw new NotFoundError("User");
  await dbConnect();
  const body = await request.json();

  const session = await mongoose.startSession();
  session.startTransaction();

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

    const existingUser = await User.findById(id).session(session);

    if (!existingUser) {
      throw new NotFoundError("User");
    }
    const updatedData: {
      name?: string;
      email?: string;
      username?: string;
      branch?: string;
      image?: string;
      salary?: number;
      role?: string;
      isStaff?: boolean;
      phone?: string;
    } = {};

    if (existingUser.name !== name) updatedData.name = name;
    if (existingUser.image !== image) updatedData.image = image;
    if (existingUser.email !== email) updatedData.email = email;
    if (existingUser.username !== slugifiedUsername)
      updatedData.username = slugifiedUsername;
    if (existingUser.branch !== branch) updatedData.branch = branch;
    if (existingUser.salary !== salary) updatedData.salary = salary;
    if (existingUser.role !== role) updatedData.role = role;
    if (existingUser.phone !== phone) updatedData.phone = phone;
    if (existingUser.isStaff !== isStaff) updatedData.isStaff = isStaff;

    if (Object.keys(updatedData).length > 0) {
      await User.updateOne(
        { _id: existingUser._id },
        { $set: updatedData }
      ).session(session);
    }

    const existingAccount = await Account.findOne({
      userId: existingUser._id,
      provider: "credentials",
      providerAccountId: email,
    }).session(session);

    if (!existingAccount) {
      await Account.create(
        [
          {
            userId: existingUser._id,
            name,
            image,
            provider: "credentials",
            providerAccountId: email,
          },
        ],
        { session }
      );
    } else {
      if (password !== undefined || password !== null || password !== "") {
        const hashPassword = await bcrypt.hash(password, 12);
        await Account.updateOne(
          { _id: existingAccount._id },
          { $set: { password: hashPassword } }
        ).session(session);
      }
    }
    await session.commitTransaction();
    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    await session.abortTransaction();
    return handleError(error, "api") as APIErrorResponse;
  } finally {
    session.endSession();
  }
}
