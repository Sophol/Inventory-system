import { endOfMonth, format, startOfMonth } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { formatCurrency } from "@/lib/utils";
interface ProfitLossProps {
  salesIncome: number;
  totalCOGS: number;
  totalExpenses: number;
  netProfit: number;
  totalDelivery: number;
  totalServiceFee: number;
  totalShippingFee: number;
  totalCost?: number;
  details:
    | {
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
        }[];
      }
    | undefined;
}
const ProfitLoss = ({
  salesIncome,
  totalCOGS,
  totalExpenses,
  netProfit,
  totalDelivery,
  totalServiceFee,
  totalShippingFee,
  totalCost,
  details,
}: ProfitLossProps) => {
  const startDate = startOfMonth(new Date());
  const endDate = endOfMonth(new Date());
  return (
    <section className="max-w-4xl mx-auto py-0">
      <div className="flex-wrap space-y-4 p-10 sm:px-4 md:px-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-center pb-2">
            <CardTitle className="text-xl text-dark400_light800 mr-4">
              Profit&Loss Statement from: {format(startDate, "yyyy-MM-dd")} to:
              {format(endDate, "yyyy-MM-dd")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="container mx-auto pt-10">
              <h1 className="h3-semibold">Sales: </h1>
              {details?.saleDetails.map((sale) => (
                <div
                  key={sale.category}
                  className="flex flex-row justify-between ml-5 p-2"
                >
                  <p className="paragraph-medium">{sale.category}:</p>
                  <p className="paragraph-medium">
                    {formatCurrency(sale.salesIncome)}
                  </p>
                </div>
              ))}
              <div className="flex flex-row justify-between ml-5 p-2">
                <p className="base-semibold">Sales Income:</p>
                <p className="base-semibold">{formatCurrency(salesIncome)}</p>
              </div>
              <h1 className="h3-semibold">COGS: </h1>
              {details?.purchaseDetails.map((purchase) => (
                <div
                  key={purchase.category}
                  className="flex flex-row justify-between ml-5 p-2"
                >
                  <p className="paragraph-medium">{purchase.category}:</p>
                  <p className="paragraph-medium">
                    {formatCurrency(purchase.totalCOGS)}
                  </p>
                </div>
              ))}
              <div className="flex flex-row justify-between ml-5 p-2">
                <p className="paragraph-medium">DeliveryFee:</p>
                <p className="paragraph-medium">
                  {formatCurrency(totalDelivery ?? 0)}
                </p>
              </div>
              <div className="flex flex-row justify-between ml-5 p-2">
                <p className="paragraph-medium">ShippingFee:</p>
                <p className="paragraph-medium">
                  {formatCurrency(totalShippingFee ?? 0)}
                </p>
              </div>
              <div className="flex flex-row justify-between ml-5 p-2">
                <p className="paragraph-medium">ServiceFee:</p>
                <p className="paragraph-medium">
                  {formatCurrency(totalServiceFee ?? 0)}
                </p>
              </div>
              <div className="flex flex-row justify-between ml-5 p-2">
                <p className="base-semibold">Total COGS:</p>
                <p className="base-semibold">{formatCurrency(totalCOGS)}</p>
              </div>
              <h1 className="h3-semibold">Expense: </h1>
              <div className="flex flex-row justify-between ml-5 p-2">
                <p className="paragraph-medium">Salary Expense:</p>
                <p className="paragraph-medium">
                  {formatCurrency(details?.salaryExpenses ?? 0)}
                </p>
              </div>
              <div className="flex flex-row justify-between ml-5  p-2">
                <p className="paragraph-medium">Missioin Expense:</p>
                <p className="paragraph-medium">
                  {formatCurrency(details?.missionExpenses ?? 0)}
                </p>
              </div>
              <div className="flex flex-row justify-between ml-5  p-2">
                <p className="paragraph-medium">General Expense:</p>
                <p className="paragraph-medium">
                  {formatCurrency(details?.generalExpenses ?? 0)}
                </p>
              </div>
              <div className="flex flex-row justify-between ml-5 p-2">
                <p className="base-semibold">Total Expense:</p>
                <p className="base-semibold">{formatCurrency(totalExpenses)}</p>
              </div>
              <div className="flex flex-row justify-between pb-5">
                <p className="base-semibold">Net Profit / (Loss):</p>
                <p className="base-semibold">{formatCurrency(netProfit)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};
export default ProfitLoss;
