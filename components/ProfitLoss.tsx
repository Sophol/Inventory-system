// components/ProfitLoss.tsx
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { formatCurrency } from "@/lib/utils";
import { DatePickerWithRange } from "../components/search/DatePickerWithRange";

interface ProfitLossProps {
  from: Date;
  to: Date;
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
  from,
  to,
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
  return (
    <section className="max-w-3xl mx-auto py-0">
      <div className="flex-wrap space-y-2 p-5 px-0 sm:px-4 md:px-8">
        <DatePickerWithRange
          initialDate={{ from, to }}
          className="w-full px-2 sm:px-0"
        />
        <Card className="py-0 my-0">
          <CardHeader className="flex flex-col md:flex-row items-center profit-loss-header-container">
            <CardTitle className="text-xl sm:flex w-full">
              <h2 className="pf-card-title justify-center sm:justify-start w-full md:w-3/4 items-center flex text-sm md:text-xl">
                Profit/Loss Statement
              </h2>
              <div className="pf-header-date w-full md:w-1/4 mt-2 md:mt-0 text-sm md:text-base">
                <h6 className="text-right">
                  from: <span>{format(from, "yyyy-MM-dd")}</span>
                </h6>
                <h6 className="text-right">
                  To:{" "}
                  <span className="ml-2 sm:ml-3">
                    {format(to, "yyyy-MM-dd")}
                  </span>
                </h6>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="container mx-auto py-1 sm:py-1 px-0">
              <div className="hidden sm:flex">
                <div className="w-4/5"></div>
                <div
                  className="w-1/5 text-right px-4 py-1"
                  style={{ backgroundColor: "#2c4375" }}
                >
                  <h2 className="text-white uppercase text-lg">Total</h2>
                </div>
              </div>

              <h1 className="text-center sm:text-left pf-title py-2">Sales</h1>
              {details?.saleDetails.map((sale) => (
                <div
                  key={sale.category}
                  className="flex flex-col sm:flex-row my-0 b-item"
                >
                  <div className="flex-1 w-full sm:w-3/5 whitespace-nowrap py-2">
                    <p className="text-sm text-left sm:text-right">
                      {sale.category}
                    </p>
                  </div>
                  <div className="w-full sm:w-1/5"></div>
                  <div className="w-full sm:w-1/5 bg-value py-2 px-3 text-right">
                    <p className="text-sm">
                      {formatCurrency(sale.salesIncome)}
                    </p>
                  </div>
                </div>
              ))}

              <div className="flex flex-col sm:flex-row my-0 b-item">
                <div className="w-full sm:w-3/5 sm:justify-end item-center flex px-0">
                  <p className="text-sm font-bold py-2 text-left sm:text-right">
                    Sales Income
                  </p>
                </div>
                <div className="w-full sm:w-1/5"></div>
                <div className="w-full sm:w-1/5 py-2 px-2 bg-value item-center flex justify-end">
                  <p className="text-sm font-bold">
                    {formatCurrency(salesIncome)}
                  </p>
                </div>
              </div>

              <h1 className="text-center sm:text-left pf-title b-item py-2">
                COGS
              </h1>
              {details?.purchaseDetails.map((purchase) => (
                <div
                  key={purchase.category}
                  className="flex flex-col sm:flex-row my-0 b-item"
                >
                  <div className="w-full sm:w-3/5 whitespace-nowrap py-2">
                    <p className="text-sm text-left sm:text-right">
                      {purchase.category}
                    </p>
                  </div>
                  <div className="w-full sm:w-1/5"></div>
                  <div className="w-full sm:w-1/5 bg-value py-2 px-3 text-right">
                    <p className="text-sm">
                      {formatCurrency(purchase.totalCOGS)}
                    </p>
                  </div>
                </div>
              ))}
              <div className="flex flex-col sm:flex-row my-0 b-item">
                <div className="w-full sm:w-3/5 py-2 sm:justify-end item-center flex px-0">
                  <p className="text-sm font-bold text-left sm:text-right">
                    Total Cost
                  </p>
                </div>
                <div className="w-full sm:w-1/5"></div>
                <div className="w-full sm:w-1/5 py-2 px-3 bg-value item-center flex justify-end">
                  <p className="text-sm font-bold">
                    {formatCurrency(totalCost ?? 0)}
                  </p>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row my-0 b-item">
                <div className="w-full sm:w-3/5 py-2 sm:justify-end item-center flex px-0">
                  <p className="text-sm text-left sm:text-right">
                    Delivery Fee
                  </p>
                </div>
                <div className="w-full sm:w-1/5"></div>
                <div className="w-full sm:w-1/5 py-2 px-3 bg-value item-center flex justify-end">
                  <p className="text-sm">
                    {formatCurrency(totalDelivery ?? 0)}
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row my-0 b-item">
                <div className="w-full sm:w-3/5 py-2 sm:justify-end item-center flex px-0">
                  <p className="text-sm text-left sm:text-right">
                    Shipping Fee
                  </p>
                </div>
                <div className="w-full sm:w-1/5"></div>
                <div className="w-full sm:w-1/5 py-2 px-3 bg-value item-center flex justify-end">
                  <p className="text-sm">
                    {formatCurrency(totalShippingFee ?? 0)}
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row my-0 b-item">
                <div className="w-full sm:w-3/5 py-2 sm:justify-end item-center flex px-0">
                  <p className="text-sm text-left sm:text-right">Service Fee</p>
                </div>
                <div className="w-full sm:w-1/5"></div>
                <div className="w-full sm:w-1/5 py-2 px-3 bg-value item-center flex justify-end">
                  <p className="text-sm">
                    {formatCurrency(totalServiceFee ?? 0)}
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row my-0 b-item">
                <div className="w-full sm:w-3/5 py-2 sm:justify-end item-center flex px-0">
                  <p className="text-sm font-bold text-left sm:text-right">
                    Total COGS
                  </p>
                </div>
                <div className="w-full sm:w-1/5"></div>
                <div className="w-full sm:w-1/5 px-3 bg-value py-2 item-center flex justify-end">
                  <p className="text-sm font-bold">
                    {formatCurrency(totalCOGS)}
                  </p>
                </div>
              </div>

              <h1 className="text-center sm:text-left pf-title b-item">
                Expense
              </h1>
              {[
                { label: "Salary Expense", value: details?.salaryExpenses },
                { label: "Mission Expense", value: details?.missionExpenses },
                { label: "General Expense", value: details?.generalExpenses },
              ].map(({ label, value }) => (
                <div
                  key={label}
                  className="flex flex-col sm:flex-row my-0 b-item"
                >
                  <div className="w-full sm:w-3/5 py-2 sm:justify-end item-center flex px-0">
                    <p className="text-sm text-left sm:text-right">{label}</p>
                  </div>
                  <div className="w-full sm:w-1/5"></div>
                  <div className="w-full sm:w-1/5 py-2 px-3 bg-value item-center flex justify-end">
                    <p className="text-sm">{formatCurrency(value ?? 0)}</p>
                  </div>
                </div>
              ))}

              <div className="flex flex-col sm:flex-row my-0 b-item">
                <div className="w-full sm:w-3/5 py-2 sm:justify-end item-center flex px-0">
                  <p className="text-sm font-bold text-left sm:text-right">
                    Total Expense
                  </p>
                </div>
                <div className="w-full sm:w-1/5"></div>
                <div className="w-full sm:w-1/5 py-2 px-3 bg-value item-center flex justify-end">
                  <p className="text-sm font-bold">
                    {formatCurrency(totalExpenses ?? 0)}
                  </p>
                </div>
              </div>

              <div
                className="flex flex-col sm:flex-row my-0 py-2"
                style={{ backgroundColor: "#2c4375", color: "white" }}
              >
                <div className="w-full sm:w-3/5 py-1 item-center flex px-3">
                  <p className="font-bold text-left sm:text-right">
                    {netProfit < 0 ? "Loss" : "Net Profit"} :
                  </p>
                </div>
                <div className="w-full sm:w-1/5"></div>
                <div className="w-full sm:w-1/5 py-1 px-3 item-center flex justify-end">
                  <p className="font-bold">{formatCurrency(netProfit ?? 0)}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default ProfitLoss;
