"use server";
import {
  Customer,
  GeneralExp,
  Mission,
  Purchase,
  Salary,
  Sale,
} from "@/database";
import { format, endOfMonth, startOfMonth, subMonths } from "date-fns";
import handleError from "../handlers/error";
import { SearchAllExpenseSchema } from "../validations";
import action from "../handlers/action";
import { getUniqueRandomColors } from "../url";
import dbConnect from "../mongoose";
const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export const getFirstRowDashboard = async () => {
  try {
    await dbConnect();
    const start = startOfMonth(new Date());
    const end = endOfMonth(new Date());
    const [
      totalInvPaymentPending,
      totalInvPaymentComplete,
      totalOrderApproved,
      totalOrderPending,
      totalSalesAmountResult,
    ] = await Promise.all([
      Sale.countDocuments({
        orderStatus: "completed",
        paymentStatus: { $in: ["pending", "credit"] },
        orderDate: { $gte: start, $lte: end },
      }),
      Sale.countDocuments({
        orderStatus: "completed",
        paymentStatus: "completed",
        orderDate: { $gte: start, $lte: end },
      }),
      Sale.countDocuments({
        orderStatus: "approved",
        orderDate: { $gte: start, $lte: end },
      }),
      Sale.countDocuments({
        orderStatus: "pending",
        orderDate: { $gte: start, $lte: end },
      }),
      Sale.aggregate([
        {
          $match: {
            orderStatus: "completed",
            orderDate: { $gte: start, $lte: end },
          },
        },
        {
          $group: {
            _id: null,
            total: { $sum: "$grandtotal" },
          },
        },
      ]),
    ]);
    const totalSalesAmount =
      totalSalesAmountResult.length > 0 ? totalSalesAmountResult[0].total : 0;
    return {
      success: true,
      data: {
        totalInvPaymentPending,
        totalInvPaymentComplete,
        totalOrderPending,
        totalOrderApproved,
        totalSalesAmount,
      },
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
};
export async function getAllExpense(params: { searchMonth: string }): Promise<
  ActionResponse<{
    totalPurchase: number;
    totalMission: number;
    totalSalary: number;
    totalGeneral: number;
    totalExpenses: number;
  }>
> {
  const validatedData = await action({
    params,
    schema: SearchAllExpenseSchema,
    authorize: true,
  });
  if (validatedData instanceof Error) {
    return handleError(validatedData) as ErrorResponse;
  }
  const { searchMonth } = validatedData.params!;
  const monthIndex = months.findIndex(
    (m) => m.toLowerCase().toString() === searchMonth.toLowerCase().toString()
  );
  if (monthIndex === -1) {
    throw new Error("Invalid month string");
  }

  const date = new Date(new Date().getFullYear(), monthIndex, 1);
  const start = startOfMonth(date);
  const end = endOfMonth(date);
  const [totalPurchase, totalMission, totalSalary, totalGeneral] =
    await Promise.all([
      Purchase.aggregate([
        {
          $match: {
            purchaseDate: { $gte: start, $lte: end },
          },
        },
        {
          $group: {
            _id: null,
            total: { $sum: "$grandtotal" },
          },
        },
      ]),
      Mission.aggregate([
        {
          $match: {
            missionDate: { $gte: start, $lte: end },
          },
        },
        {
          $group: {
            _id: null,
            total: { $sum: "$amount" },
          },
        },
      ]),
      Salary.aggregate([
        {
          $match: {
            salaryDate: { $gte: start, $lte: end },
          },
        },
        {
          $group: {
            _id: null,
            total: { $sum: "$netSalary" },
          },
        },
      ]),
      GeneralExp.aggregate([
        {
          $match: {
            generalDate: { $gte: start, $lte: end },
          },
        },
        {
          $group: {
            _id: null,
            total: { $sum: "$amount" },
          },
        },
      ]),
    ]);
  const totalPurchaseAmount =
    totalPurchase.length > 0 ? totalPurchase[0].total : 0;
  const totalMissionAmount =
    totalMission.length > 0 ? totalMission[0].total : 0;
  const totalSalaryAmount = totalSalary.length > 0 ? totalSalary[0].total : 0;
  const totalGeneralAmount =
    totalGeneral.length > 0 ? totalGeneral[0].total : 0;
  const totalExpenses =
    totalPurchaseAmount +
    totalMissionAmount +
    totalGeneralAmount +
    totalSalaryAmount;
  return {
    success: true,
    data: {
      totalPurchase: totalPurchaseAmount,
      totalMission: totalMissionAmount,
      totalSalary: totalSalaryAmount,
      totalGeneral: totalGeneralAmount,
      totalExpenses,
    },
  };
}
interface RevenueByProvince {
  province: string;
  revenue: number;
  fill: string;
}
export async function getRevenueByProvince(params: {
  searchMonth: string;
}): Promise<ActionResponse<{ data: RevenueByProvince[] }>> {
  const validatedData = await action({
    params,
    schema: SearchAllExpenseSchema,
    authorize: true,
  });
  if (validatedData instanceof Error) {
    return handleError(validatedData) as ErrorResponse;
  }
  const { searchMonth } = validatedData.params!;
  const monthIndex = months.findIndex(
    (m) => m.toLowerCase() === searchMonth.toLowerCase()
  );
  if (monthIndex === -1) {
    throw new Error("Invalid month string");
  }

  const date = new Date(new Date().getFullYear(), monthIndex, 1);
  const start = startOfMonth(date);
  const end = endOfMonth(date);

  const matchStage = {
    "sales.orderDate": { $gte: start, $lte: end },
    "sales.orderStatus": "completed",
  };

  const result = await Customer.aggregate([
    {
      $lookup: {
        from: "sales",
        localField: "_id",
        foreignField: "customer",
        as: "sales",
      },
    },
    {
      $unwind: "$sales",
    },
    {
      $match: matchStage,
    },
    {
      $group: {
        _id: "$province",
        revenue: { $sum: "$sales.grandtotal" },
      },
    },
    {
      $project: {
        _id: 0,
        province: "$_id",
        revenue: 1,
      },
    },
  ]);

  const data = result.map((item, index) => ({
    province: item.province,
    revenue: item.revenue,
    fill: getUniqueRandomColors(index), // Add appropriate fill value if needed
  }));
  return {
    success: true,
    data: JSON.parse(JSON.stringify(data)),
  };
}

export const getSalesDataLast6Months = async () => {
  try {
    const end = new Date();
    const start = subMonths(startOfMonth(end), 5);

    const salesData = await Sale.aggregate([
      {
        $match: {
          orderDate: { $gte: start, $lte: end },
          orderStatus: "completed",
        },
      },
      {
        $group: {
          _id: { $month: "$orderDate" },
          grandtotal: { $sum: "$grandtotal" },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);

    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    const currentMonth = end.getMonth() + 1;
    const last6Months = Array.from(
      { length: 6 },
      (_, i) => ((currentMonth - i + 11) % 12) + 1
    ).reverse();

    const chartData = last6Months.map((month) => {
      const monthData = salesData.find((data) => data._id === month);
      return {
        month: months[month - 1],
        revenue: monthData ? monthData.grandtotal : 0,
      };
    });
    return chartData;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to fetch sales data for the last 6 months");
  }
};
export const getRecentOrders = async () => {
  try {
    const recentOrders = await Sale.find()
      .sort({ orderDate: -1 })
      .limit(5)
      .populate("customer", "name")
      .populate("branch", "title")
      .exec();

    return recentOrders.map((order) => ({
      customer: order.customer.name,
      referenceNo: order.referenceNo,
      status: order.orderStatus,
      branch: order.branch.title,
      date: format(new Date(order.orderDate), "dd/MM/yyyy HH:mm:ss"),
      amount: `${order.grandtotal}`,
    }));
  } catch (error) {
    console.error(error);
    throw new Error("Failed to fetch recent orders");
  }
};
