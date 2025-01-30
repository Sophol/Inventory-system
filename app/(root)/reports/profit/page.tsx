import DataRenderer from "@/components/DataRenderer";
import ProfitLoss from "@/components/ProfitLoss";
import { DEFAULT_EMPTY } from "@/constants/states";
import { getProfitAndLossReport } from "@/lib/actions/saleReport";
import { checkAuthorization } from "@/lib/auth";
import { redirect } from "next/navigation";

const Profit = async () => {
  const isAuthorized = await checkAuthorization([
    "admin",
    "branch",
    "stock",
    "seller",
  ]);
  if (!isAuthorized) {
    return redirect("/unauthorized");
  }
  const { success, data, error } = await getProfitAndLossReport({});

  return (
    <DataRenderer
      success={success}
      error={error}
      data={data?.details?.purchaseDetails || []}
      empty={DEFAULT_EMPTY}
      render={() => (
        <ProfitLoss
          salesIncome={data?.salesIncome ?? 0}
          totalCOGS={data?.totalCOGS ?? 0}
          totalDelivery={data?.totalDelivery ?? 0}
          totalServiceFee={data?.totalServiceFee ?? 0}
          totalShippingFee={data?.totalShippingFee ?? 0}
          totalExpenses={data?.totalExpenses ?? 0}
          netProfit={data?.netProfit ?? 0}
          details={data?.details}
        />
      )}
    />
  );
};
export default Profit;
