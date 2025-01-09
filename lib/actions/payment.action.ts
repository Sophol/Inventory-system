"use server";
import { FilterQuery } from "mongoose";

import { Payment, Sale } from "@/database";

import { IPaymentDoc } from "@/database/payment.model";


import { editSale, getSale } from "@/lib/actions/sale.action";

import action from "../handlers/action";
import handleError from "../handlers/error";

import {
  CreatePaymentSchema,
  GetPaymentSchema,
  PaginatedSearchParamsPaymentSchema,
} from "../validations";

export async function createPayment(
  params: CreatePaymentParams
): Promise<ActionResponse<IPaymentDoc>> {
  const validatedData = await action({
    params,
    schema: CreatePaymentSchema,
    authorize: true,
  });
  if (validatedData instanceof Error) {
    return handleError(validatedData.message) as ErrorResponse;
  }
  try {
   

    const success = await Payment.create(validatedData.params);
    if(success){
      const saleData = await Sale.findById(params.sale);
      if (saleData) {
        saleData.paid = saleData.paid + (params.paidAmount ?? 0);
        if(saleData.paid == saleData.balance){
          saleData.paymentStatus = "completed";
        }
        await saleData.save();
      }
    }
    return { success: true };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}

export async function getPayments(
  params: PaginatedSearchParamsPayment
): Promise<ActionResponse<{ payment: Payment[]; isNext: boolean }>> {
  const validatedData = await action({
    params,
    schema: PaginatedSearchParamsPaymentSchema,
    authorize: true,
  });
  if (validatedData instanceof Error) {
    return handleError(validatedData) as ErrorResponse;
  }
  const { page = 1, pageSize = 10, query, filter } = params;
  const skip = (Number(page) - 1) * pageSize;
  const limit = Number(pageSize);
  // sale : params.sale
  const filterQuery: FilterQuery<typeof Payment> = {sale : params.sale};
  if (query) {
    filterQuery.$or = [
      { name: { $regex: new RegExp(query, "i") } },
      { status: { $regex: new RegExp(query, "i") } },
    ];
  }
  let sortCriteria = {};

  switch (filter) {
    case "paymentDate":
      sortCriteria = { name: -1 };
      break;
    case "paidBy":
      sortCriteria = { status: -1 };
      break;
    case "creditAmount":
      sortCriteria = { status: -1 };
      break;
    default:
      sortCriteria = { createdAt: -1 };
      break;
  }
  try {
    const [totalPayments, payments] = await Promise.all([
      Payment.countDocuments(filterQuery),
      Payment.find(filterQuery)
        .populate("customer", "name")
        .lean()
        .sort(sortCriteria)
        .skip(skip)
        .limit(limit),
     
    ]);
    console.log("totalPayments, payments", payments);
    const isNext = totalPayments > skip + payments.length;

    return {
      success: true,
      data: { payment: JSON.parse(JSON.stringify(payments)), isNext },
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}
export async function getPayment(
  params: GetPaymentParams
): Promise<ActionResponse<Payment>> {
  const validatedData = await action({
    params,
    schema: GetPaymentSchema,
    authorize: true,
  });
  if (validatedData instanceof Error) {
    return handleError(validatedData) as ErrorResponse;
  }
  const { saleId } = validatedData.params!;
  try {
    const payment = await Payment.findOne({ sale: saleId })
    .sort({ createdAt: -1 }) // Sort by paymentDate in descending order
    .lean();

    return { success: true, data: JSON.parse(JSON.stringify(payment ? payment : [])) };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}
