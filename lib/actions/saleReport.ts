import mongoose, { FilterQuery } from "mongoose";
import action from "../handlers/action";
import handleError from "../handlers/error";
import { SaleSearchParamsSchema } from "../validations";
import {
  GeneralExp,
  Mission,
  Purchase,
  PurchaseDetail,
  Salary,
  Sale,
  SaleDetail,
} from "@/database";
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
  if (dateRange) {
    const [from, to] = dateRange.split("_");
    filterQuery.invoicedDate = {
      $gte: new Date(
        Date.UTC(
          new Date(from).getFullYear(),
          new Date(from).getMonth(),
          new Date(from).getDate()
        )
      ),
      $lte: new Date(
        Date.UTC(
          new Date(to).getFullYear(),
          new Date(to).getMonth(),
          new Date(to).getDate(),
          23,
          59,
          59
        )
      ),
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

export async function getProfitAndLossReport(params: SaleSearchParams): Promise<
  ActionResponse<{
    salesIncome: number;
    totalCOGS: number;
    totalExpenses: number;
    netProfit: number;
    totalDelivery: number;
    totalServiceFee: number;
    totalShippingFee: number;
    totalCost: number;
    details: {
      salesIncome: number;
      totalCOGS: number;
      salaryExpenses: number;
      missionExpenses: number;
      generalExpenses: number;
      netProfit: number;
      saleDetails: {
        category: string;
        productName: string;
        salesIncome: number;
      }[];
      purchaseDetails: {
        category: string;
        productName: string;
        totalCOGS: number;
        salesIncome?: number;
      }[];
    };
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
  const { branchId, dateRange } = params;
  const filterQuery: FilterQuery<typeof Sale> = { orderStatus: "completed" };
  const filterQuerySaleDetail: FilterQuery<typeof SaleDetail> = {
    "saleDetails.orderStatus": "completed",
  };
  const filterQueryPurchase: FilterQuery<typeof Purchase> = {
    orderStatus: "completed",
  };
  const filterQueryPurchaseDetail: FilterQuery<typeof PurchaseDetail> = {
    "purchaseDetails.orderStatus": "completed",
  };
  const filterQueryExp: FilterQuery<typeof GeneralExp> = {};
  const filterQueryMission: FilterQuery<typeof Mission> = {};
  const filterQuerySalary: FilterQuery<typeof Salary> = {};

  if (branchId) {
    filterQuery.branch = new ObjectId(branchId);
  }
  const start = startOfMonth(new Date());
  const end = endOfMonth(new Date());
  if (dateRange) {
    const [from, to] = dateRange.split("_");
    filterQuery.invoicedDate = {
      $gte: new Date(
        Date.UTC(
          new Date(from).getFullYear(),
          new Date(from).getMonth(),
          new Date(from).getDate()
        )
      ),
      $lte: new Date(
        Date.UTC(
          new Date(to).getFullYear(),
          new Date(to).getMonth(),
          new Date(to).getDate(),
          23,
          59,
          59
        )
      ),
    };
    filterQueryPurchase.purchaseDate = {
      $gte: new Date(
        Date.UTC(
          new Date(from).getFullYear(),
          new Date(from).getMonth(),
          new Date(from).getDate()
        )
      ),
      $lte: new Date(
        Date.UTC(
          new Date(to).getFullYear(),
          new Date(to).getMonth(),
          new Date(to).getDate(),
          23,
          59,
          59
        )
      ),
    };
    filterQueryExp.generalDate = {
      $gte: new Date(
        Date.UTC(
          new Date(from).getFullYear(),
          new Date(from).getMonth(),
          new Date(from).getDate()
        )
      ),
      $lte: new Date(
        Date.UTC(
          new Date(to).getFullYear(),
          new Date(to).getMonth(),
          new Date(to).getDate(),
          23,
          59,
          59
        )
      ),
    };
    filterQueryMission.missionDate = {
      $gte: new Date(
        Date.UTC(
          new Date(from).getFullYear(),
          new Date(from).getMonth(),
          new Date(from).getDate()
        )
      ),
      $lte: new Date(
        Date.UTC(
          new Date(to).getFullYear(),
          new Date(to).getMonth(),
          new Date(to).getDate(),
          23,
          59,
          59
        )
      ),
    };
    filterQuerySalary.salaryDate = {
      $gte: new Date(
        Date.UTC(
          new Date(from).getFullYear(),
          new Date(from).getMonth(),
          new Date(from).getDate()
        )
      ),
      $lte: new Date(
        Date.UTC(
          new Date(to).getFullYear(),
          new Date(to).getMonth(),
          new Date(to).getDate(),
          23,
          59,
          59
        )
      ),
    };
    filterQuerySaleDetail["saleDetails.invoicedDate"] = {
      $gte: new Date(
        Date.UTC(
          new Date(from).getFullYear(),
          new Date(from).getMonth(),
          new Date(from).getDate()
        )
      ),
      $lte: new Date(
        Date.UTC(
          new Date(to).getFullYear(),
          new Date(to).getMonth(),
          new Date(to).getDate(),
          23,
          59,
          59
        )
      ),
    };
    filterQueryPurchaseDetail["purchaseDetails.purchaseDate"] = {
      $gte: new Date(
        Date.UTC(
          new Date(from).getFullYear(),
          new Date(from).getMonth(),
          new Date(from).getDate()
        )
      ),
      $lte: new Date(
        Date.UTC(
          new Date(to).getFullYear(),
          new Date(to).getMonth(),
          new Date(to).getDate(),
          23,
          59,
          59
        )
      ),
    };
  } else {
    filterQuery.invoicedDate = {
      $gte: start,
      $lte: end,
    };
    filterQueryPurchase.purchaseDate = {
      $gte: start,
      $lte: end,
    };
    filterQueryExp.generalDate = {
      $gte: start,
      $lte: end,
    };
    filterQueryMission.missionDate = {
      $gte: start,
      $lte: end,
    };
    filterQuerySalary.salaryDate = {
      $gte: start,
      $lte: end,
    };
    filterQuerySaleDetail["saleDetails.invoicedDate"] = {
      $gte: start,
      $lte: end,
    };
    filterQueryPurchaseDetail["purchaseDetails.purchaseDate"] = {
      $gte: start,
      $lte: end,
    };
  }

  try {
    const [
      salesIncomeData,
      cogsData,
      salaryExpensesData,
      missionExpensesData,
      generalExpensesData,
      saleDetailsData,
      purchaseDetailsData,
    ] = await Promise.all([
      Sale.aggregate([
        { $match: filterQuery },
        {
          $lookup: {
            from: "saledetails",
            localField: "_id",
            foreignField: "sale",
            as: "saleDetails",
          },
        },
        {
          $unwind: "$saleDetails",
        },
        {
          $group: {
            _id: "$_id",
            totalSalesIncome: { $sum: "$saleDetails.totalPrice" },
            totalCOGS: { $sum: "$saleDetails.totalCost" },
            profit: {
              $sum: {
                $subtract: [
                  "$saleDetails.totalPrice",
                  "$saleDetails.totalCost",
                ],
              },
            },
          },
        },
        {
          $group: {
            _id: null,
            totalSalesIncome: { $sum: "$totalSalesIncome" },
            totalCOGS: { $sum: "$totalCOGS" },
            totalProfit: { $sum: "$profit" },
          },
        },
      ]),
      Purchase.aggregate([
        { $match: filterQueryPurchase },
        {
          $group: {
            _id: null,
            totalCost: { $sum: "$grandtotal" },
            totalServiceFee: { $sum: "$serviceFee" },
            totalShippingFee: { $sum: "$shippingFee" },
            totalDelivery: {
              $sum: {
                $add: ["$deliveryIn", "$deliveryOut"],
              },
            },
          },
        },
      ]),
      Salary.aggregate([
        { $match: filterQuerySalary },
        {
          $group: {
            _id: null,
            totalSalaryExpenses: { $sum: "$netSalary" },
          },
        },
      ]),
      Mission.aggregate([
        { $match: filterQueryMission },
        {
          $group: {
            _id: null,
            totalMissionExpenses: { $sum: "$amount" },
          },
        },
      ]),
      GeneralExp.aggregate([
        { $match: filterQueryExp },
        {
          $group: {
            _id: null,
            totalGeneralExpenses: { $sum: "$amount" },
          },
        },
      ]),
      SaleDetail.aggregate([
        {
          $lookup: {
            from: "sales",
            localField: "sale",
            foreignField: "_id",
            as: "saleDetails",
          },
        },
        {
          $unwind: "$saleDetails",
        },
        { $match: filterQuerySaleDetail },
        {
          $lookup: {
            from: "products",
            localField: "product",
            foreignField: "_id",
            as: "productDetails",
          },
        },
        {
          $unwind: "$productDetails",
        },
        {
          $lookup: {
            from: "categories",
            localField: "productDetails.category",
            foreignField: "_id",
            as: "categoryDetails",
          },
        },
        {
          $unwind: "$categoryDetails",
        },
        {
          $group: {
            _id: {
              category: "$categoryDetails.title",
            },
            salesIncome: { $sum: "$totalPrice" },
            totalCOGS: { $sum: "$totalCost" },
          },
        },
        {
          $project: {
            _id: 0,
            category: "$_id.category",
            salesIncome: 1,
            totalCOGS: 1,
          },
        },
      ]),
      PurchaseDetail.aggregate([
        {
          $lookup: {
            from: "purchases",
            localField: "purchase",
            foreignField: "_id",
            as: "purchaseDetails",
          },
        },
        {
          $unwind: "$purchaseDetails",
        },
        {
          $match: filterQueryPurchaseDetail,
        },
        {
          $lookup: {
            from: "products",
            localField: "product",
            foreignField: "_id",
            as: "productDetails",
          },
        },
        {
          $unwind: "$productDetails",
        },
        {
          $lookup: {
            from: "categories",
            localField: "productDetails.category",
            foreignField: "_id",
            as: "categoryDetails",
          },
        },
        {
          $unwind: "$categoryDetails",
        },
        {
          $group: {
            _id: {
              category: "$categoryDetails.title",
            },
            totalCOGS: { $sum: "$total" },
          },
        },
        {
          $project: {
            _id: 0,
            category: "$_id.category",
            totalCOGS: 1,
          },
        },
      ]),
    ]);

    const totalSalesIncome = salesIncomeData[0]?.totalSalesIncome || 0;
    const totalDelivery = cogsData[0]?.totalDelivery || 0;
    const totalServiceFee = cogsData[0]?.totalServiceFee || 0;
    const totalShippingFee = cogsData[0]?.totalShippingFee || 0;
    const totalCost = cogsData[0]?.totalCost || 0;
    const totalCOGS =
      totalCost + totalDelivery + totalServiceFee + totalShippingFee;

    const totalSalaryExpenses = salaryExpensesData[0]?.totalSalaryExpenses || 0;
    const totalMissionExpenses =
      missionExpensesData[0]?.totalMissionExpenses || 0;
    const totalGeneralExpenses =
      generalExpensesData[0]?.totalGeneralExpenses || 0;

    const totalExpenses =
      totalSalaryExpenses + totalMissionExpenses + totalGeneralExpenses;
    const netProfit = totalSalesIncome - totalCOGS - totalExpenses;

    return {
      success: true,
      data: {
        salesIncome: totalSalesIncome,
        totalCOGS,
        totalExpenses,
        totalDelivery,
        totalServiceFee,
        totalShippingFee,
        totalCost,
        netProfit,
        details: {
          salesIncome: totalSalesIncome,
          totalCOGS,
          salaryExpenses: totalSalaryExpenses,
          missionExpenses: totalMissionExpenses,
          generalExpenses: totalGeneralExpenses,
          netProfit,
          saleDetails: saleDetailsData,
          purchaseDetails: purchaseDetailsData,
        },
      },
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}
