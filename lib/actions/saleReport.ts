import mongoose, { FilterQuery } from "mongoose";
import action from "../handlers/action";
import handleError from "../handlers/error";
import { SaleSearchParamsSchema } from "../validations";
import { Sale } from "@/database";
import { endOfMonth, startOfMonth } from "date-fns";
const ObjectId = mongoose.Types.ObjectId;
export async function getSaleReports(params: SaleSearchParams): Promise<
  ActionResponse<{
    sales: Sale[];
    summary: {
      count: 0;
      totalGrandtotal: 0;
      totalDiscount: 0;
      totalDelivery: 0;
      totalBalance: 0;
      totalPaid: 0;
    };
    isNext: boolean;
  }>
> {
  const validatedData = await action({
    params,
    schema: SaleSearchParamsSchema,
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
    customerId,
    branchId,
    dateRange,
  } = params;
  const skip = (Number(page) - 1) * pageSize;
  const limit = Number(pageSize);
  const filterQuery: FilterQuery<typeof Sale> = {};
  if (query) {
    filterQuery.$or = [
      { referenceNo: { $regex: new RegExp(query, "i") } },
      { description: { $regex: new RegExp(query, "i") } },
      { orderStatus: { $regex: new RegExp(query, "i") } },
      { paymentStatus: { $regex: new RegExp(query, "i") } },
    ];
  }
  if (customerId) {
    filterQuery.customer = new ObjectId(customerId);
  }

  if (branchId) {
    filterQuery.branch = new ObjectId(branchId);
  }
  const start = startOfMonth(new Date());
  const end = endOfMonth(new Date());
  if (dateRange) {
    const [from, to] = dateRange.split("_");
    filterQuery.invoicedDate = {
      $gte: new Date(from),
      $lte: new Date(to),
    };
  } else {
    filterQuery.invoicedDate = {
      $gte: start,
      $lte: end,
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
    const [totalSales, sales] = await Promise.all([
      Sale.aggregate([
        { $match: filterQuery },
        {
          $group: {
            _id: null,
            count: { $sum: 1 },
            grandtotal: { $sum: "$grandtotal" },
            discount: { $sum: "$discount" },
            delivery: { $sum: "$delivery" },
            paid: { $sum: "$paid" },
            balance: { $sum: "$balance" },
          },
        },
      ]),
      Sale.find(filterQuery)
        .populate("customer", "name")
        .populate("branch", "title")
        .lean()
        .sort(sortCriteria)
        .skip(skip)
        .limit(limit),
    ]);
    const count = totalSales[0]?.count || 0;
    const totalGrandtotal = totalSales[0]?.grandtotal || 0;
    const totalDiscount = totalSales[0]?.discount || 0;
    const totalDelivery = totalSales[0]?.delivery || 0;
    const totalBalance = totalSales[0]?.balance || 0;
    const totalPaid = totalSales[0]?.paid || 0;
    const isNext = count > skip + sales.length;
    const summaryData = {
      count,
      totalGrandtotal,
      totalDiscount,
      totalDelivery,
      totalBalance,
      totalPaid,
    };
    return {
      success: true,
      data: {
        sales: JSON.parse(JSON.stringify(sales)),
        summary: JSON.parse(JSON.stringify(summaryData)),
        isNext,
      },
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}
