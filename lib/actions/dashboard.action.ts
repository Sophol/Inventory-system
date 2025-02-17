"use server";
import {
  Customer,
  GeneralExp,
  Mission,
  Purchase,
  Salary,
  Sale,
} from "@/database";
import {
  format,
  endOfMonth,
  startOfMonth,
  subMonths,
  startOfYear,
  subYears,
  endOfYear,
} from "date-fns";
import handleError from "../handlers/error";
import {
  SearchAllExpenseSchema,
  SearchAnnualSummarySchema,
} from "../validations";
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
export async function getAllExpense(params: {
  searchMonth: string;
  searchYear: number;
}): Promise<
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
  const { searchMonth, searchYear } = validatedData.params!;
  const monthIndex = months.findIndex(
    (m) => m.toLowerCase() === searchMonth.toLowerCase()
  );
  if (monthIndex === -1) {
    throw new Error("Invalid month string");
  }

  const date = new Date(searchYear, monthIndex, 1);
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
  searchYear: number;
}): Promise<ActionResponse<{ data: RevenueByProvince[] }>> {
  const validatedData = await action({
    params,
    schema: SearchAllExpenseSchema,
    authorize: true,
  });
  if (validatedData instanceof Error) {
    return handleError(validatedData) as ErrorResponse;
  }
  const { searchMonth, searchYear } = validatedData.params!;
  const monthIndex = months.findIndex(
    (m) => m.toLowerCase() === searchMonth.toLowerCase()
  );
  if (monthIndex === -1) {
    throw new Error("Invalid month string");
  }

  const date = new Date(searchYear, monthIndex, 1);
  const start = startOfMonth(date);
  const end = endOfMonth(date);

  const matchStage = {
    "sales.invoicedDate": { $gte: start, $lte: end },
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
    { $sort: { province: 1 } },
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

export async function getAnnualSummary(params: {
  searchYear: number;
}): Promise<ActionResponse<{ data: AnnualSummary[] }>> {
  const validatedData = await action({
    params,
    schema: SearchAnnualSummarySchema,
    authorize: true,
  });

  if (validatedData instanceof Error) {
    return handleError(validatedData) as ErrorResponse;
  }

  const { searchYear } = validatedData.params!;
  const start = new Date(searchYear, 0, 1); // Start of the year (Jan 1)
  const end = new Date(searchYear, 11, 31, 23, 59, 59); // End of the year (Dec 31)

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
        totalSales: { $sum: "$grandtotal" },
      },
    },
  ]);

  const purchasesData = await Purchase.aggregate([
    {
      $match: {
        purchaseDate: { $gte: start, $lte: end },
      },
    },
    {
      $group: {
        _id: { $month: "$purchaseDate" },
        totalPurchases: { $sum: "$grandtotal" },
        totalServiceFee: {
          $sum: {
            $add: [
              "$deliveryIn",
              "$deliveryOut",
              "$serviceFee",
              "$shippingFee",
            ],
          },
        },
      },
    },
  ]);

  const salaryData = await Salary.aggregate([
    {
      $match: {
        salaryDate: { $gte: start, $lte: end },
      },
    },
    {
      $group: {
        _id: { $month: "$salaryDate" },
        totalSalaryExpense: { $sum: "$netSalary" },
      },
    },
  ]);

  const missionExpenseData = await Mission.aggregate([
    {
      $match: {
        missionDate: { $gte: start, $lte: end },
      },
    },
    {
      $group: {
        _id: { $month: "$missionDate" },
        totalMissionExpense: { $sum: "$amount" },
      },
    },
  ]);

  const generalExpenseData = await GeneralExp.aggregate([
    {
      $match: {
        generalDate: { $gte: start, $lte: end },
      },
    },
    {
      $group: {
        _id: { $month: "$generalDate" },
        totalGeneralExpense: { $sum: "$amount" },
      },
    },
  ]);

  const summaryMap = new Map();

  // Initialize the summaryMap with all months set to zero values
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

  months.forEach((month, index) => {
    summaryMap.set(index + 1, {
      month,
      sale: 0,
      purchase: 0,
      serviceFee: 0,
      expense: 0,
      grossProfit: 0,
      profit: 0,
    });
  });

  salesData.forEach(({ _id, totalSales }) => {
    summaryMap.get(_id)!.sale = totalSales;
  });

  purchasesData.forEach(({ _id, totalPurchases, totalServiceFee }) => {
    summaryMap.get(_id)!.purchase = totalPurchases;
    summaryMap.get(_id)!.serviceFee = totalServiceFee;
  });

  salaryData.forEach(({ _id, totalSalaryExpense }) => {
    summaryMap.get(_id)!.expense += totalSalaryExpense;
  });

  missionExpenseData.forEach(({ _id, totalMissionExpense }) => {
    summaryMap.get(_id)!.expense += totalMissionExpense;
  });

  generalExpenseData.forEach(({ _id, totalGeneralExpense }) => {
    summaryMap.get(_id)!.expense += totalGeneralExpense;
  });

  const result = Array.from(summaryMap.values()).map((entry) => ({
    ...entry,
    grossProfit: entry.sale - entry.purchase,
    profit: entry.sale - entry.purchase - entry.expense + entry.serviceFee,
  }));
  return {
    success: true,
    data: JSON.parse(JSON.stringify(result)),
  };
}

export async function getAnnualSummaryByear(): Promise<
  ActionResponse<{ data: AnnualSummaryByYear[] }>
> {
  const currentYear = new Date().getFullYear();
  const start = startOfYear(subYears(new Date(), 4)); // Start of the year 5 years ago
  const end = endOfYear(new Date()); // End of the current year

  const salesData = await Sale.aggregate([
    {
      $match: {
        orderDate: { $gte: start, $lte: end },
        orderStatus: "completed",
      },
    },
    {
      $group: {
        _id: { $year: "$orderDate" },
        totalSales: { $sum: "$grandtotal" },
      },
    },
  ]);

  const purchasesData = await Purchase.aggregate([
    {
      $match: {
        purchaseDate: { $gte: start, $lte: end },
      },
    },
    {
      $group: {
        _id: { $year: "$purchaseDate" },
        totalPurchases: { $sum: "$grandtotal" },
        totalServiceFee: {
          $sum: {
            $add: [
              "$deliveryIn",
              "$deliveryOut",
              "$serviceFee",
              "$shippingFee",
            ],
          },
        },
      },
    },
  ]);

  const salaryData = await Salary.aggregate([
    {
      $match: {
        salaryDate: { $gte: start, $lte: end },
      },
    },
    {
      $group: {
        _id: { $year: "$salaryDate" },
        totalSalaryExpense: { $sum: "$netSalary" },
      },
    },
  ]);

  const missionExpenseData = await Mission.aggregate([
    {
      $match: {
        missionDate: { $gte: start, $lte: end },
      },
    },
    {
      $group: {
        _id: { $year: "$missionDate" },
        totalMissionExpense: { $sum: "$amount" },
      },
    },
  ]);

  const generalExpenseData = await GeneralExp.aggregate([
    {
      $match: {
        generalDate: { $gte: start, $lte: end },
      },
    },
    {
      $group: {
        _id: { $year: "$generalDate" },
        totalGeneralExpense: { $sum: "$amount" },
      },
    },
  ]);

  const summaryMap = new Map();

  // Initialize the summaryMap with all years set to zero values
  for (let year = currentYear - 4; year <= currentYear; year++) {
    summaryMap.set(year, {
      year,
      sale: 0,
      purchase: 0,
      serviceFee: 0,
      expense: 0,
      grossProfit: 0,
      profit: 0,
    });
  }

  salesData.forEach(({ _id, totalSales }) => {
    summaryMap.get(_id)!.sale = totalSales;
  });

  purchasesData.forEach(({ _id, totalPurchases, totalServiceFee }) => {
    summaryMap.get(_id)!.purchase = totalPurchases;
    summaryMap.get(_id)!.serviceFee = totalServiceFee;
  });

  salaryData.forEach(({ _id, totalSalaryExpense }) => {
    summaryMap.get(_id)!.expense += totalSalaryExpense;
  });

  missionExpenseData.forEach(({ _id, totalMissionExpense }) => {
    summaryMap.get(_id)!.expense += totalMissionExpense;
  });

  generalExpenseData.forEach(({ _id, totalGeneralExpense }) => {
    summaryMap.get(_id)!.expense += totalGeneralExpense;
  });

  const result = Array.from(summaryMap.values()).map((entry) => ({
    ...entry,
    grossProfit: entry.sale - entry.purchase,
    profit: entry.sale - entry.purchase - entry.expense + entry.serviceFee,
  }));
  return {
    success: true,
    data: JSON.parse(JSON.stringify(result)),
  };
}
