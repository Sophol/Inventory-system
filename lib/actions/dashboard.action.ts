import {
  GeneralExp,
  Mission,
  Product,
  Purchase,
  Salary,
  Sale,
} from "@/database";
import { format , endOfMonth, startOfMonth, subMonths } from "date-fns";
import handleError from "../handlers/error";
import dbConnect from "../mongoose";

export const getFirstRowDashboard = async () => {
  await dbConnect();
  try {
    const start = startOfMonth(new Date());
    const end = endOfMonth(new Date());
    const [
      totalSales,
      totalOrderPending,
      totalProducts,
      totalSalesAmountResult,
    ] = await Promise.all([
      Sale.countDocuments({
        orderStatus: "completed",
        orderDate: { $gte: start, $lte: end },
      }),
      Sale.countDocuments({
        orderStatus: "pending",
        orderDate: { $gte: start, $lte: end },
      }),
      Product.countDocuments(),
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
      data: { totalSales, totalOrderPending, totalProducts, totalSalesAmount },
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
};
export const getAllExpense = async () => {
  const start = startOfMonth(new Date());
  const end = endOfMonth(new Date());
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
            total: { $sum: "$amount" },
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
};
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
