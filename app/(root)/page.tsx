import { Button } from "@/components/ui/button";
import { LayoutDashboard, ShoppingCart } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import * as React from "react";
import {
  getAllExpense,
  getAnnualSummary,
  getFirstRowDashboard,
  getRecentOrders,
  getRevenueByProvince,
} from "@/lib/actions/dashboard.action";
import { checkAuthorization } from "@/lib/auth";
import { notFound, redirect } from "next/navigation";
import { ExpensePieChart } from "@/components/dashboard/ExpensePieChart";
import { RevenueByProvincePieChart } from "@/components/dashboard/RevenueByProvincePieChart";
import { AnnualSummaryChart } from "@/components/dashboard/AnnualSummaryChart";
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
  const recentOrders = await getRecentOrders();
  return (
    <>
      <section>
        <div className="flex-1 space-y-4 p-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Orders Pending
                </CardTitle>
                <ShoppingCart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-lg font-bold">
                  {data.totalOrderPending}
                </div>
                <Button
                  variant="link"
                  className="px-0 text-xs text-muted-foreground"
                >
                  View Details
                </Button>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Order Approved
                </CardTitle>
                <LayoutDashboard className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-lg font-bold">
                  {formatCurrency(data.totalOrderApproved)}
                </div>
                <Button
                  variant="link"
                  className="px-0 text-xs text-muted-foreground"
                >
                  View Details
                </Button>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Invoice Pending Payment
                </CardTitle>
                <LayoutDashboard className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-lg font-bold">
                  {formatCurrency(data.totalInvPaymentPending)}
                </div>
                <Button
                  variant="link"
                  className="px-0 text-xs text-muted-foreground"
                >
                  View Details
                </Button>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Invoice Complete Payment
                </CardTitle>
                <LayoutDashboard className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-lg font-bold">
                  {formatCurrency(data.totalInvPaymentComplete)}
                </div>
                <Button
                  variant="link"
                  className="px-0 text-xs text-muted-foreground"
                >
                  View Details
                </Button>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Revenue
                </CardTitle>
                <span className="paragraph-meduim">៛</span>
              </CardHeader>
              <CardContent>
                <div className="text-lg font-bold">
                  {formatCurrency(data.totalSalesAmount)}
                </div>
                <Button
                  variant="link"
                  className="px-0 text-xs text-muted-foreground"
                >
                  View Details
                </Button>
              </CardContent>
            </Card>
          </div>
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
            <AnnualSummaryChart annaulSummary={annaulSummary} />
          </div>
          <Card>
            <CardHeader>
              <CardTitle>Recent Orders</CardTitle>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Customer</TableHead>
                    <TableHead>Branch</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentOrders.map((order, index) => (
                    <TableRow key={index}>
                      <TableCell>{order.customer}</TableCell>
                      <TableCell>{order.branch}</TableCell>
                      <TableCell>
                        <Badge
                          className={
                            order.status === "completed"
                              ? "bg-green-500 uppercase"
                              : order.status === "approved"
                                ? "bg-blue-500 uppercase"
                                : order.status === "pending"
                                  ? "bg-yellow-500 uppercase"
                                  : "bg-red-500 uppercase"
                          }
                        >
                          {order.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{order.date}</TableCell>
                      <TableCell>
                        {formatCurrency(parseInt(order.amount))}
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardHeader>
          </Card>
        </div>
      </section>
    </>
  );
};

export default Home;
