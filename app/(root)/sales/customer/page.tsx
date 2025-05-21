import React from "react";
import { CiCirclePlus } from "react-icons/ci";

import { CustomerColumn } from "@/columns/CustomerColumn";
import CardContainer from "@/components/cards/CardContainer";
import DataRenderer from "@/components/DataRenderer";
import LocalSearch from "@/components/search/LocalSearch";
import { DataTable } from "@/components/table/DataTable";
import ROUTES from "@/constants/routes";
import { CUSTOMER_EMPTY } from "@/constants/states";
import { getCustomers } from "@/lib/actions/customer.action";
import { checkAuthorization } from "@/lib/auth";
import { redirect } from "next/navigation";
import { TableCell, TableRow } from "@/components/ui/table";
import { formatCurrency } from "@/lib/utils";

interface SearchParams {
  searchParams: Promise<{ [key: string]: string }>;
}

const Customer = async ({ searchParams }: SearchParams) => {
  const isAuthorized = await checkAuthorization(["admin", "branch", "seller"]);
  if (!isAuthorized) {
    return redirect("/unauthorized");
  }
  const { page, pageSize, query, filter } = await searchParams;
  const { success, data, error } = await getCustomers({
    page: Number(page) || 1,
    pageSize: Number(pageSize) || 10,
    query: query || "",
    filter: filter || "",
  });
  const { customers, summary, isNext } = data || {};
  const summaryRow = (
    <TableRow className="bg-blue-200 dark:bg-slate-800">
      <TableCell colSpan={4} className="text-right">
        <strong>Total:</strong>
      </TableCell>
      <TableCell className="text-right">
        <strong className="px-4">
          {formatCurrency(summary?.totalBalance ?? 0)}
        </strong>
      </TableCell>
      <TableCell></TableCell>
    </TableRow>
  );
  return (
    <CardContainer
      title="customer"
      redirectTitle="add"
      redirectHref={ROUTES.ADDCUSTOMER}
      redirectIcon={CiCirclePlus}
      redirectClass="!text-light-900 primary-gradient"
    >
      <>
        <div className="py-4">
          <LocalSearch route={ROUTES.CUSTOMERS} placeholder="Search..." />
        </div>
        <DataRenderer
          success={success}
          error={error}
          data={customers}
          empty={CUSTOMER_EMPTY}
          render={() => (
            <DataTable
              columns={CustomerColumn}
              data={customers!}
              summaryRow={summaryRow}
              isNext={isNext}
              totalCount={summary?.count}
            />
          )}
        />
      </>
    </CardContainer>
  );
};

export default Customer;
