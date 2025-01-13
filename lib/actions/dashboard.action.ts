import { Product, Sale } from "@/database";
import { endOfMonth, startOfMonth } from "date-fns";
import handleError from "../handlers/error";

export const getFirstRowDashboard = async () => {
  try {
    const start = startOfMonth(new Date());
    const end = endOfMonth(new Date());

    const totalSales = await Sale.countDocuments({
      orderStatus: "completed",
      orderDate: { $gte: start, $lte: end },
    });
    const totalOrderPending = await Sale.countDocuments({
      orderStatus: "pending",
      orderDate: { $gte: start, $lte: end },
    });
    const totalProducts = await Product.countDocuments();
    const totalSalesAmountResult = await Sale.aggregate([
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
