import React from "react";
import { CiCirclePlus } from "react-icons/ci";

import CardContainer from "@/components/cards/CardContainer";
import DataRenderer from "@/components/DataRenderer";
import { DataTable } from "@/components/table/DataTable";
import ROUTES from "@/constants/routes";
import { PURCHASE_EMPTY } from "@/constants/states";
import { checkAuthorization } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getSaleReports } from "@/lib/actions/saleReport";
import { SaleReportColumn } from "@/columns/SaleReportColumn";
import SaleSearch from "@/components/search/SaleSearch";
import { TableCell, TableRow } from "@/components/ui/table";

interface SearchParams {
  searchParams: Promise<{ [key: string]: string }>;
}

const SaleReport = async ({ searchParams }: SearchParams) => {
  const isAuthorized = await checkAuthorization(["admin", "branch", "stock"]);
  if (!isAuthorized) {
    return redirect("/unauthorized");
  }
  const { page, pageSize, query, filter, customerId, branchId, dateRange } =
    await searchParams;
  const { success, data, error } = await getSaleReports({
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
        totalPaid: 0;
        totalBalance: 0;
      };
      isNext: boolean;
    });
  const summaryRow = (
    <TableRow>
      <TableCell colSpan={4} className="text-right">
        <strong>Total:</strong>
      </TableCell>
      <TableCell>
        <strong>{summary.totalGrandtotal}</strong>
      </TableCell>
      <TableCell>
        <strong>{summary.totalDiscount}</strong>
      </TableCell>
      <TableCell>
        <strong>{summary.totalDelivery}</strong>
      </TableCell>
      <TableCell>
        <strong>{summary.totalPaid}</strong>
      </TableCell>
      <TableCell>
        <strong>{summary.totalBalance}</strong>
      </TableCell>
    </TableRow>
  );
  return (
    <CardContainer
      title="Sale Report"
      redirectTitle=""
      redirectHref=""
      redirectIcon={CiCirclePlus}
      redirectClass="!text-light-900 primary-gradient"
    >
      <>
        <div className="py-4">
          <SaleSearch route={ROUTES.SALEREPORT} />
        </div>
        <DataRenderer
          success={success}
          error={error}
          data={sales}
          empty={PURCHASE_EMPTY}
          render={() => (
            <DataTable
              columns={SaleReportColumn}
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

export default SaleReport;
