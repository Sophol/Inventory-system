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
    <TableRow>
      <TableCell colSpan={4} className="text-right">
        <strong>Total:</strong>
      </TableCell>
      <TableCell>
        <strong>{summary?.totalGrandtotal}</strong>
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
        <div className="py-4">
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
            />
          )}
        />
      </>
    </CardContainer>
  );
};

export default PendingOrder;
