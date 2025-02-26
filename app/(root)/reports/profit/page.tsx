// pages/profit.tsx (or app/profit/page.tsx in Next.js 13+)
import { parse } from "date-fns";
import ProfitLoss from "@/components/ProfitLoss";
import { getProfitAndLossReport } from "@/lib/actions/saleReport";
import { checkAuthorization } from "@/lib/auth";
import { redirect } from "next/navigation";
import { startOfMonth, endOfMonth } from "date-fns";
import "./profitStatement.css";

interface SearchParams {
  searchParams: Promise<{ [key: string]: string }>;
}

const Profit = async ({ searchParams }: SearchParams) => {
  const isAuthorized = await checkAuthorization([
    "admin",
    "branch",
    "stock",
    "seller",
  ]);
  if (!isAuthorized) {
    return redirect("/unauthorized");
  }

  const { dateRange } = await searchParams;
  let from: Date, to: Date;
  if (dateRange) {
    const [fromStr, toStr] = dateRange.split("_");
    from = parse(fromStr, "yyyy-MM-dd", new Date());
    to = parse(toStr, "yyyy-MM-dd", new Date());
  } else {
    from = startOfMonth(new Date());
    to = endOfMonth(new Date());
  }

  const { success, data, error } = await getProfitAndLossReport({ dateRange });

  return (
    <ProfitLoss
      from={from}
      to={to}
      salesIncome={data?.salesIncome ?? 0}
      totalCOGS={data?.totalCOGS ?? 0}
      totalCost={data?.totalCost ?? 0}
      totalDelivery={data?.totalDelivery ?? 0}
      totalServiceFee={data?.totalServiceFee ?? 0}
      totalShippingFee={data?.totalShippingFee ?? 0}
      totalExpenses={data?.totalExpenses ?? 0}
      netProfit={data?.netProfit ?? 0}
      details={data?.details}
    />
  );
};

export default Profit;
