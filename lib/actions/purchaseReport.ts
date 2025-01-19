"use server";
import mongoose, { FilterQuery } from "mongoose";
import action from "../handlers/action";
import handleError from "../handlers/error";
import { PurchaseSearchParamsSchema } from "../validations";
import { Purchase } from "@/database";
import { endOfMonth, startOfMonth } from "date-fns";
const ObjectId = mongoose.Types.ObjectId;
export async function getPurchaseReports(params: PurchaseSearchParams): Promise<
  ActionResponse<{
    purchases: Purchase[];
    summary: { count: 0; totalGrandtotal: 0 };
    isNext: boolean;
  }>
> {
  const validatedData = await action({
    params,
    schema: PurchaseSearchParamsSchema,
    authorize: true,
  });
  if (validatedData instanceof Error) {
    return handleError(validatedData) as ErrorResponse;
  }
  const {
    page = 1,
    pageSize = 10,
    query,
    filter,
    supplierId,
    branchId,
    dateRange,
  } = params;
  const skip = (Number(page) - 1) * pageSize;
  const limit = Number(pageSize);
  const filterQuery: FilterQuery<typeof Purchase> = {};

  if (query) {
    filterQuery.$or = [
      { referenceNo: { $regex: new RegExp(query, "i") } },
      { description: { $regex: new RegExp(query, "i") } },
      { orderStatus: { $regex: new RegExp(query, "i") } },
      { paymentStatus: { $regex: new RegExp(query, "i") } },
    ];
  }

  if (supplierId) {
    filterQuery.supplier = new ObjectId(supplierId);
  }

  if (branchId) {
    filterQuery.branch = new ObjectId(branchId);
  }

  if (dateRange) {
    const [from, to] = dateRange.split("_");
    filterQuery.purchaseDate = {
      $gte: new Date(from),
      $lte: new Date(to),
    };
  } else {
    filterQuery.purchaseDate = {
      $gte: startOfMonth(new Date()),
      $lte: endOfMonth(new Date()),
    };
  }

  let sortCriteria = {};

  switch (filter) {
    case "referenceNo":
      sortCriteria = { referenceNo: -1 };
      break;
    case "orderStatus":
      sortCriteria = { orderStatus: -1 };
      break;
    case "paymentStatus":
      sortCriteria = { paymentStatus: -1 };
      break;
    default:
      sortCriteria = { createdAt: -1 };
      break;
  }

  try {
    const [aggregationResult, purchases] = await Promise.all([
      Purchase.aggregate([
        { $match: filterQuery },
        {
          $group: {
            _id: null,
            count: { $sum: 1 },
            totalGrandtotal: { $sum: "$grandtotal" },
          },
        },
      ]),
      Purchase.find(filterQuery)
        .populate("supplier", "name")
        .populate("branch", "title")
        .lean()
        .sort(sortCriteria)
        .skip(skip)
        .limit(limit),
    ]);
    const count = aggregationResult[0]?.count || 0;
    const totalGrandtotal = aggregationResult[0]?.totalGrandtotal || 0;
    const isNext = count > skip + purchases.length;
    const totalCount = { count, totalGrandtotal };
    return {
      success: true,
      data: {
        purchases: JSON.parse(JSON.stringify(purchases)),
        summary: JSON.parse(JSON.stringify(totalCount)),
        isNext,
      },
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}
