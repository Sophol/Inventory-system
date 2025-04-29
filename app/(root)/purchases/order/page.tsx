import React from "react";
import { CiCirclePlus } from "react-icons/ci";

import CardContainer from "@/components/cards/CardContainer";
import DataRenderer from "@/components/DataRenderer";
import { DataTable } from "@/components/table/DataTable";
import ROUTES from "@/constants/routes";
import { PURCHASE_EMPTY } from "@/constants/states";
import { checkAuthorization } from "@/lib/auth";
import { redirect } from "next/navigation";
import PurchaseSearch from "@/components/search/PurchaseSearch";
import { TableCell, TableRow } from "@/components/ui/table";
import { PurchaseColumn } from "@/columns/PurchaseColumn";
import { getPurchases } from "@/lib/actions/purchase.action";
import { formatCurrency } from "@/lib/utils";

interface SearchParams {
  searchParams: Promise<{ [key: string]: string }>;
}

const PurchaseReport = async ({ searchParams }: SearchParams) => {
  const isAuthorized = await checkAuthorization(["admin", "branch", "stock"]);
  if (!isAuthorized) {
    return redirect("/unauthorized");
  }

  const {
    page,
    pageSize,
    query,
    filter,
    supplierId,
    branchId,
    dateRange,
    customerId,
  } = await searchParams;
  const { success, data, error } = await getPurchases({
    page: Number(page) || 1,
    pageSize: Number(pageSize) || 10,
    query: query?.toString() || "",
    filter: filter?.toString() || "",
    supplierId: supplierId?.toString() || "",
    branchId: branchId?.toString() || "",
    customerId: customerId?.toString() || "",
    dateRange: dateRange?.toString() || "",
  });

  const { purchases, summary, isNext } = data || {
    purchases: [],
    summary: { count: 0, totalGrandtotal: 0 },
    isNext: false,
  };

  const summaryRow = (
    <TableRow className="bg-blue-200 dark:bg-slate-800">
      <TableCell colSpan={6} className="text-right">
        <strong>Total:</strong>
      </TableCell>
      <TableCell className="text-right">
        <strong>{formatCurrency(summary?.totalGrandtotal)}</strong>
      </TableCell>
      <TableCell></TableCell>
    </TableRow>
  );

  return (
    <CardContainer
      title="purchase"
      redirectTitle="add"
      redirectHref={ROUTES.ADDPURCHASE}
      redirectIcon={CiCirclePlus}
      redirectClass="!text-light-900 primary-gradient w-full sm:w-auto bg-red-600 mt-0 text-[11px]  min-h-[26px] h-[26px]"
    >
      <div className="pb-4">
        <PurchaseSearch route={ROUTES.PURCHASEREPORT} />
      </div>
      <DataRenderer
        success={success}
        error={error}
        data={purchases}
        empty={PURCHASE_EMPTY}
        render={() => (
          <DataTable
            columns={PurchaseColumn}
            data={purchases}
            summaryRow={summaryRow}
            isNext={isNext}
            totalCount={summary?.count}
          />
        )}
      />
    </CardContainer>
  );
};

export default PurchaseReport;
