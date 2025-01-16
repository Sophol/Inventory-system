import React from "react";
import { CiCirclePlus } from "react-icons/ci";

import CardContainer from "@/components/cards/CardContainer";
import DataRenderer from "@/components/DataRenderer";
import { DataTable } from "@/components/table/DataTable";
import ROUTES from "@/constants/routes";
import { PURCHASE_EMPTY } from "@/constants/states";
import { checkAuthorization } from "@/lib/auth";
import { redirect } from "next/navigation";
import { PurchaseReportColumn } from "@/columns/PurchaseReportColumn";
import PurchaseSearch from "@/components/search/PurchaseSearch";
import { getPurchaseReports } from "@/lib/actions/purchaseReport";
import { TableCell, TableRow } from "@/components/ui/table";

interface SearchParams {
  searchParams: { [key: string]: string | string[] | undefined };
}

const PurchaseReport = async ({ searchParams }: SearchParams) => {
  const isAuthorized = await checkAuthorization(["admin", "branch", "stock"]);
  if (!isAuthorized) {
    return redirect("/unauthorized");
  }

  const { page, pageSize, query, filter, supplierId, branchId, dateRange } =
    searchParams;
  const { success, data, error } = await getPurchaseReports({
    page: Number(page) || 1,
    pageSize: Number(pageSize) || 10,
    query: query?.toString() || "",
    filter: filter?.toString() || "",
    supplierId: supplierId?.toString() || "",
    branchId: branchId?.toString() || "",
    dateRange: dateRange?.toString() || "",
  });

  const { purchases, summary, isNext } = data || {
    purchases: [],
    summary: { count: 0, totalGrandtotal: 0 },
    isNext: false,
  };
  const summaryRow = (
    <TableRow>
      <TableCell colSpan={3} className="text-right">
        <strong>Total:</strong>
      </TableCell>
      <TableCell>
        <strong>{summary.totalGrandtotal}</strong>
      </TableCell>
    </TableRow>
  );
  return (
    <CardContainer
      title="Purchase"
      redirectTitle="ADD"
      redirectHref={ROUTES.ADDPURCHASE}
      redirectIcon={CiCirclePlus}
      redirectClass="!text-light-900 primary-gradient"
    >
      <div className="py-4">
        <PurchaseSearch route={ROUTES.PURCHASEREPORT} />
      </div>
      <DataRenderer
        success={success}
        error={error}
        data={purchases}
        empty={PURCHASE_EMPTY}
        render={() => (
          <DataTable
            columns={PurchaseReportColumn}
            data={purchases}
            summaryRow={summaryRow}
            isNext={isNext}
          />
        )}
      />
    </CardContainer>
  );
};

export default PurchaseReport;
