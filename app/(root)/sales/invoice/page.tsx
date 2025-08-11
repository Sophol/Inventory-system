import React from "react";

import { SaleColumn } from "@/columns/OrderCompleteColumn";
import CardContainer from "@/components/cards/CardContainer";
import DataRenderer from "@/components/DataRenderer";
import { DataTable } from "@/components/table/DataTable";
import ROUTES from "@/constants/routes";
import { SALE_EMPTY } from "@/constants/states";
import { CiCirclePlus } from "react-icons/ci";
import { checkAuthorization } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getInvoices } from "@/lib/actions/invoice.action";
import { TableCell, TableRow } from "@/components/ui/table";
import SaleSearch from "@/components/search/SaleSearch";
import { formatCurrency } from "@/lib/utils";
interface SearchParams {
  searchParams: Promise<{ [key: string]: string }>;
}

const CompleteOrder = async ({ searchParams }: SearchParams) => {
  const isAuthorized = await checkAuthorization(["admin", "branch", "seller"]);
  if (!isAuthorized) {
    return redirect("/unauthorized");
  }
  const {
    page,
    pageSize,
    query,
    filter,
    customerId,
    branchId,
    dateRange,
    customerType,
  } = await searchParams;
  const { success, data, error } = await getInvoices({
    page: Number(page) || 1,
    pageSize: Number(pageSize) || 10,
    query: query || "",
    filter: filter || "",
    customerId: customerId || "",
    branchId: branchId || "",
    dateRange: dateRange || "",
    customerType: customerType || "",
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
    <TableRow className="bg-blue-200 dark:bg-slate-800">
      <TableCell colSpan={4} className="text-right ">
        <strong>Total:</strong>
      </TableCell>
      <TableCell className="text-right  ">
        <strong className="px-4">
          {formatCurrency(summary?.totalGrandtotal)}
        </strong>
      </TableCell>
      <TableCell className="text-right ">
        <strong className="px-4">
          {formatCurrency(summary?.totalDiscount)}
        </strong>
      </TableCell>
      <TableCell className="text-right  ">
        <strong className="px-4">
          {formatCurrency(summary?.totalDelivery)}
        </strong>
      </TableCell>
      <TableCell className="text-right  ">
        <strong className="px-4">{formatCurrency(summary?.totalPaid)}</strong>
      </TableCell>
      <TableCell className="text-right  ">
        <strong className="px-4">
          {" "}
          {formatCurrency(summary?.totalBalance)}
        </strong>
      </TableCell>
      <TableCell></TableCell>
      <TableCell></TableCell>
      <TableCell></TableCell>
    </TableRow>
  );
  return (
    <CardContainer
      title="invoice"
      redirectTitle="add"
      redirectHref={ROUTES.ADDINVOICE}
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

export default CompleteOrder;
