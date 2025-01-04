"use server";
import mongoose, { FilterQuery } from "mongoose";

import { Payment } from "@/database";
// import { ISaleDetailDoc } from "@/database/sale-detail.model";
import { IPaymentDoc } from "@/database/payment.model";

import action from "../handlers/action";
import handleError from "../handlers/error";

import {
  CreatePaymentSchema,
} from "../validations";
import { ActionResponse, ErrorResponse } from "../types";
export async function createPayment(
  params: CreatePaymentParams
): Promise<ActionResponse<IPaymentDoc>> {
  console.log(params);
  const validatedData = await action({
    params,
    schema: CreatePaymentSchema,
    authorize: true,
  });
  if (validatedData instanceof Error) {
    return handleError(validatedData.message) as ErrorResponse;
  }
  const {
    customer,
    branch,
    referenceNo,
    description,
    paymentDate,
    creditAmount,
    paidAmount,
    balance,
    paidBy,
    paymentStatus
  } = validatedData.params!;
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const [payment] = await Payment.create(
      [
        {
          customer,
          branch,
          referenceNo,
          description,
          paymentDate,
          creditAmount,
          paidAmount,
          balance,
          paidBy,
          paymentStatus
        },
      ],
      { session }
    );
    return { success: true, data: JSON.parse(JSON.stringify(payment)) };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}