import React from "react";
import { CiCirclePlus } from "react-icons/ci";

import { SaleColumn } from "@/columns/OrderPendingColumn";
import CardContainer from "@/components/cards/CardContainer";
import DataRenderer from "@/components/DataRenderer";
import { DataTable } from "@/components/table/DataTable";
import ROUTES from "@/constants/routes";
import { SALE_EMPTY } from "@/constants/states";
import { getPendingOrder } from "@/lib/actions/sale.action";
import { checkAuthorization } from "@/lib/auth";
import { redirect } from "next/navigation";
import SaleSearch from "@/components/search/SaleSearch";
import { TableCell, TableRow } from "@/components/ui/table";
import { formatCurrency } from '@/lib/utils';
interface SearchParams {
  searchParams: Promise<{ [key: string]: string }>;
}

const PendingOrder = async ({ searchParams }: SearchParams) => {
  const isAuthorized = await checkAuthorization(["admin", "branch", "seller"]);
  if (!isAuthorized) {
    return redirect("/unauthorized");
  }
  const { page, pageSize, query, filter, customerId, branchId, dateRange } =
    await searchParams;
  const { success, data, error } = await getPendingOrder({
    page: Number(page) || 1,
    pageSize: Number(pageSize) || 10,
    query: query || "",
    filter: filter || "",
    customerId: customerId || "",
    branchId: branchId || "",
    dateRange: dateRange || "",
  });
  const { sales, summary, isNext } =
    data ||
    ({} as {
      sales: Sale[];
      summary: {
        count: 0;
        totalGrandtotal: 0;
        totalDiscount: 0;
        totalDelivery: 0;
      };
      isNext: boolean;
    });
  const summaryRow = (
    <TableRow className="bg-blue-200 dark:bg-slate-800">
      <TableCell colSpan={4} className="text-right">
        <strong className="px-4">Total:</strong>
      </TableCell>
      <TableCell className="text-right ">
        <strong className="px-4">{formatCurrency(summary?.totalGrandtotal)}</strong>
      </TableCell>
      <TableCell colSpan={3}>
        
      </TableCell>
    </TableRow>
  );
  return (
    <CardContainer
      title="Pening Order"
      redirectTitle="ADD"
      redirectHref={ROUTES.SALES}
      redirectIcon={CiCirclePlus}
      redirectClass="!text-light-900 primary-gradient"
    >
      <>
        <div className="pb-4">
          <SaleSearch route={ROUTES.SALES} />
        </div>
        <DataRenderer
          success={success}
          error={error}
          data={sales}
          empty={SALE_EMPTY}
          render={() => (
            <DataTable
              columns={SaleColumn}
              data={sales!}
              summaryRow={summaryRow}
              isNext={isNext}
              totalCount={summary.count}
            />
          )}
        />
      </>
    </CardContainer>
  );
};

export default PendingOrder;
