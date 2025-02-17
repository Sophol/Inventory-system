import * as React from "react";
import {
  getAllExpense,
  getAnnualSummary,
  getAnnualSummaryByear,
  getFirstRowDashboard,
  getRevenueByProvince,
} from "@/lib/actions/dashboard.action";
import { checkAuthorization } from "@/lib/auth";
import { notFound, redirect } from "next/navigation";
import { ExpensePieChart } from "@/components/dashboard/ExpensePieChart";
import { RevenueByProvincePieChart } from "@/components/dashboard/RevenueByProvincePieChart";
import { MonthlyPrfoit } from "@/components/dashboard/MonthlyProfit";
import SummarySale from "@/components/dashboard/SummarySale";
import { YearlyPrfoit } from "@/components/dashboard/YearlyProfit";
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
const Home = async () => {
  const isAuthorized = await checkAuthorization(["admin", "branch"]);
  if (!isAuthorized) {
    return redirect("/unauthorized");
  }
  const { success, data } = await getFirstRowDashboard();
  if (!success) return notFound();
  const expenseData = await getAllExpense({
    searchMonth: months[new Date().getMonth()],
    searchYear: new Date().getFullYear(),
  });
  const chartExpenseData = expenseData.data
    ? [
        {
          expense: "purchase",
          amount: expenseData.data.totalPurchase,
          fill: "var(--color-purchase)",
        },
        {
          expense: "general",
          amount: expenseData.data.totalGeneral,
          fill: "var(--color-general)",
        },
        {
          expense: "mission",
          amount: expenseData.data.totalMission,
          fill: "var(--color-mission)",
        },
        {
          expense: "salary",
          amount: expenseData.data.totalSalary,
          fill: "var(--color-salary)",
        },
      ]
    : [];
  const revenueResponse = await getRevenueByProvince({
    searchMonth: months[new Date().getMonth()],
    searchYear: new Date().getFullYear(),
  });
  const revenueData = revenueResponse?.data ?? [];
  const revenueChart = Array.isArray(revenueData)
    ? revenueData.map(
        (item: { province: string; revenue: number; fill: string }) => ({
          province: item.province,
          revenue: item.revenue,
          fill: item.fill,
        })
      )
    : [];
  const { data: annaulSummary } = await getAnnualSummary({
    searchYear: new Date().getFullYear(),
  });
  const { data: AnnualSummaryByYear } = await getAnnualSummaryByear();
  return (
    <>
      <section>
        <div className="flex-1 space-y-4 p-4">
          <SummarySale
            totalInvPaymentComplete={data.totalInvPaymentComplete}
            totalInvPaymentPending={data.totalInvPaymentComplete}
            totalOrderApproved={data.totalOrderApproved}
            totalOrderPending={data.totalOrderPending}
            totalSalesAmount={data.totalSalesAmount}
          />
          <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-2">
            {expenseData.data && (
              <ExpensePieChart
                initialChartData={chartExpenseData}
                initialTotalExpense={expenseData.data.totalExpenses}
              />
            )}
            {revenueData && (
              <RevenueByProvincePieChart initialChartData={revenueChart} />
            )}
          </div>
          <div className="grid grid-cols-1">
            <MonthlyPrfoit annaulSummary={annaulSummary} />
          </div>
          <div className="grid grid-cols-1">
            <YearlyPrfoit annaulSummary={AnnualSummaryByYear} />
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;
