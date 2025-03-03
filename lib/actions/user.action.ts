"use server";
import mongoose, { FilterQuery } from "mongoose";
import action from "../handlers/action";
import handleError from "../handlers/error";
import {
  DeleteUserParamSchema,
  PaginatedSearchParamsSchema,
  ProfileSchema,
} from "../validations";
import { Account, Salary, Sale, User } from "@/database";
import { auth } from "@/auth";
import { NotFoundError } from "../http-errors";
import bcrypt from "bcryptjs";

export async function getUsers(
  params: PaginatedSearchParams
): Promise<
  ActionResponse<{ users: User[]; totalCount: number; isNext: boolean }>
> {
  const validatedData = await action({
    params,
    schema: PaginatedSearchParamsSchema,
    authorize: true,
  });
  if (validatedData instanceof Error) {
    return handleError(validatedData) as ErrorResponse;
  }
  const { page = 1, pageSize = 10, query, filter } = params;
  const skip = (Number(page) - 1) * pageSize;
  const limit = Number(pageSize);
  const filterQuery: FilterQuery<typeof User> = {};
  if (query) {
    filterQuery.$or = [
      { name: { $regex: new RegExp(query, "i") } },
      { username: { $regex: new RegExp(query, "i") } },
      { email: { $regex: new RegExp(query, "i") } },
      { phone: { $regex: new RegExp(query, "i") } },
    ];
  }
  let sortCriteria = {};

  switch (filter) {
    case "name":
      sortCriteria = { name: -1 };
      break;
    case "username":
      sortCriteria = { username: -1 };
      break;
    case "email":
      sortCriteria = { email: -1 };
      break;
    case "phone":
      sortCriteria = { phone: -1 };
      break;
    default:
      sortCriteria = { createdAt: -1 };
      break;
  }
  try {
    const [totalUsers, users] = await Promise.all([
      User.countDocuments(filterQuery),
      User.find(filterQuery).lean().sort(sortCriteria).skip(skip).limit(limit),
    ]);
    const isNext = totalUsers > skip + users.length;

    return {
      success: true,
      data: {
        users: JSON.parse(JSON.stringify(users)),
        totalCount: totalUsers,
        isNext,
      },
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}
export async function getStaffs(
  params: PaginatedSearchParams
): Promise<ActionResponse<{ users: User[]; isNext: boolean }>> {
  const validatedData = await action({
    params,
    schema: PaginatedSearchParamsSchema,
    authorize: true,
  });
  if (validatedData instanceof Error) {
    return handleError(validatedData) as ErrorResponse;
  }
  const { page = 1, pageSize = 10, query, filter } = params;
  const skip = (Number(page) - 1) * pageSize;
  const limit = Number(pageSize);
  const filterQuery: FilterQuery<typeof User> = { isStaff: true };
  if (query) {
    filterQuery.$or = [
      { name: { $regex: new RegExp(query, "i") } },
      { username: { $regex: new RegExp(query, "i") } },
    ];
  }
  let sortCriteria = {};

  switch (filter) {
    case "name":
      sortCriteria = { name: -1 };
      break;
    case "username":
      sortCriteria = { username: -1 };
      break;
  }
  try {
    const [totalUsers, users] = await Promise.all([
      User.countDocuments(filterQuery),
      User.find(filterQuery).lean().sort(sortCriteria).skip(skip).limit(limit),
    ]);
    const isNext = totalUsers > skip + users.length;

    return {
      success: true,
      data: { users: JSON.parse(JSON.stringify(users)), isNext },
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}
export async function getUserRole() {
  const user = await auth();
  return user?.user.role ?? null;
}
export async function deleteUser(
  params: DeleteUserParams
): Promise<ActionResponse> {
  const validatedData = await action({
    params,
    schema: DeleteUserParamSchema,
    authorize: true,
  });
  if (validatedData instanceof Error) {
    return handleError(validatedData) as ErrorResponse;
  }
  const { userId } = validatedData.params!;
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }
    const [sales, salary] = await Promise.all([
      Sale.findOne({ seller: userId }),
      Salary.findOne({ staffId: userId }),
    ]);

    if (sales || salary) {
      throw new Error("User បានប្រើរួចហើយ");
    }
    await User.deleteOne({ _id: user._id });
    await Account.deleteMany({ userId: user._id });
    await session.commitTransaction();
    return { success: true };
  } catch (error) {
    await session.abortTransaction();
    return handleError(error) as ErrorResponse;
  } finally {
    await session.endSession();
  }
}
export async function updateProfile(
  params: ProfileParams
): Promise<ActionResponse<User>> {
  const validatedData = await action({
    params,
    schema: ProfileSchema,
    authorize: true,
  });
  if (validatedData instanceof Error) {
    return handleError(validatedData) as ErrorResponse;
  }
  const { userId, name, email, password, image } = validatedData.params!;
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const existingUser = await User.findById(userId).session(session);

    if (!existingUser) {
      throw new NotFoundError("User");
    }
    const updatedData: {
      name?: string;
      email?: string;
      image?: string;
    } = {};

    if (existingUser.name !== name) updatedData.name = name;
    if (existingUser.image !== image) updatedData.image = image;
    if (existingUser.email !== email) updatedData.email = email;

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
    return {
      success: true,
      data: JSON.parse(JSON.stringify(existingUser)),
    };
  } catch (error: unknown) {
    await session.abortTransaction();
    return handleError(error, "api") as APIErrorResponse;
  } finally {
    session.endSession();
  }
}
