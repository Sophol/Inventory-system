import Account from "@/database/account.model";
import handleError from "@/lib/handlers/error";
import { ForbiddenError, ValidationError } from "@/lib/http-errors";
import dbConnect from "@/lib/mongoose";
import { AccountSchema } from "@/lib/validations";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await dbConnect();
    const accounts = await Account.find();
    return NextResponse.json(
      { success: true, data: accounts },
      { status: 200 }
    );
  } catch (error) {
    return handleError(error, "api") as APIErrorResponse;
  }
}
export async function POST(request: Request) {
  try {
    await dbConnect();
    const body = await request.json();
    const validateData = AccountSchema.safeParse(body);
    if (!validateData.success) {
      throw new ValidationError(validateData.error.flatten().fieldErrors);
    }
    const existingAccount = await Account.findOne({
      provider: validateData.data.provider,
      providerAccountId: validateData.data.providerAccountId,
    });
    if (existingAccount)
      throw new ForbiddenError("Account with the same provider already exist");
    const newAccount = await Account.create(validateData.data);
    return NextResponse.json(
      { success: true, data: newAccount },
      { status: 201 }
    );
  } catch (error) {
    return handleError(error, "api") as APIErrorResponse;
  }
}
