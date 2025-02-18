import React from "react";
import { CiCirclePlus } from "react-icons/ci";

import CardContainer from "@/components/cards/CardContainer";
import DataRenderer from "@/components/DataRenderer";
import { DataTable } from "@/components/table/DataTable";
import ROUTES from "@/constants/routes";
import { GENERALEXP_EMPTY } from "@/constants/states";
import { getGeneralExps } from "@/lib/actions/generalExp.action";
import { checkAuthorization } from "@/lib/auth";
import { redirect } from "next/navigation";
import { GeneralExpColumn } from "@/columns/GeneralExpColumn";
import { ColumnDef } from "@tanstack/react-table";
import GeneralExpSearch from "@/components/search/GeneralExpSearch";
import { TableCell, TableRow } from "@/components/ui/table";
import { formatCurrency } from '@/lib/utils';
interface SearchParams {
  searchParams: Promise<{ [key: string]: string }>;
}

const GeneralExp = async ({ searchParams }: SearchParams) => {
  const isAuthorized = await checkAuthorization(["admin", "branch"]);
  if (!isAuthorized) {
    return redirect("/unauthorized");
  }
  const { page, pageSize, query, filter, branchId, dateRange } =
    await searchParams;
  const { success, data, error } = await getGeneralExps({
    page: Number(page) || 1,
    pageSize: Number(pageSize) || 10,
    query: query || "",
    filter: filter || "",
    branchId: branchId?.toString() || "",
    dateRange: dateRange?.toString() || "",
  });
  const { generalExps, summary, isNext } =
    data ||
    ({} as {
      generalExps: GeneralExp[];
      summary: { count: 0; totalAmount: 0 };
      isNext: boolean;
    });
  const summaryRow = (
    <TableRow className="bg-blue-200 dark:bg-slate-800">
      <TableCell colSpan={3} className="text-right">
        <strong className="px-4">Total:</strong>
      </TableCell>
      <TableCell  className="text-right">
        <strong className="px-4">{formatCurrency(summary?.totalAmount)}</strong>
      </TableCell>
      <TableCell>
        
      </TableCell>
    </TableRow>
  );
  return (
    <CardContainer
      title="General Expenses"
      redirectTitle="ADD"
      redirectHref={ROUTES.ADDGENERALEXP}
      redirectIcon={CiCirclePlus}
      redirectClass="!text-light-900 primary-gradient"
    >
      <>
        <div className="py-4">
          <GeneralExpSearch route={ROUTES.GENERALEXPS} />
        </div>
        <DataRenderer
          success={success}
          error={error}
          data={generalExps}
          empty={GENERALEXP_EMPTY}
          render={() => (
            <DataTable
              columns={GeneralExpColumn as ColumnDef<GeneralExp, unknown>[]}
              data={generalExps!}
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

export default GeneralExp;
