import React from "react";
import { CiCirclePlus } from "react-icons/ci";

import CardContainer from "@/components/cards/CardContainer";
import DataRenderer from "@/components/DataRenderer";
import { DataTable } from "@/components/table/DataTable";
import ROUTES from "@/constants/routes";
import { SALARY_EMPTY } from "@/constants/states";
import { getSalaries } from "@/lib/actions/salary.action";
import { checkAuthorization } from "@/lib/auth";
import { redirect } from "next/navigation";
import { SalaryColumn } from "@/columns/SalaryColumn";
import SalarySearch from "@/components/search/SalarySearch";
import { TableCell, TableRow } from "@/components/ui/table";

interface SearchParams {
  searchParams: Promise<{ [key: string]: string }>;
}

const Salary = async ({ searchParams }: SearchParams) => {
  const isAuthorized = await checkAuthorization(["admin", "branch"]);
  if (!isAuthorized) {
    return redirect("/unauthorized");
  }
  const { page, pageSize, query, filter, staffId, branchId, dateRange } =
    await searchParams;
  const { success, data, error } = await getSalaries({
    page: Number(page) || 1,
    pageSize: Number(pageSize) || 10,
    query: query || "",
    filter: filter || "",
    staffId: staffId?.toString() || "",
    branchId: branchId?.toString() || "",
    dateRange: dateRange?.toString() || "",
  });
  const { salaries, summary, isNext } =
    data ||
    ({} as {
      salaries: Salary[];
      summary: { count: 0; totalAmount: 0 };
      isNext: boolean;
    });
  const summaryRow = (
    <TableRow>
      <TableCell colSpan={6} className="text-right">
        <strong>Total:</strong>
      </TableCell>
      <TableCell>
        <strong>{summary.totalAmount}</strong>
      </TableCell>
    </TableRow>
  );
  return (
    <CardContainer
      title="Salary"
      redirectTitle="ADD"
      redirectHref={ROUTES.ADDSALARYEXP}
      redirectIcon={CiCirclePlus}
      redirectClass="!text-light-900 primary-gradient"
    >
      <>
        <div className="py-4">
          <SalarySearch route={ROUTES.SALARYEXPS} />
        </div>
        <DataRenderer
          success={success}
          error={error}
          data={salaries}
          empty={SALARY_EMPTY}
          render={() => (
            <DataTable
              columns={SalaryColumn}
              data={salaries!}
              summaryRow={summaryRow}
              isNext={isNext}
            />
          )}
        />
      </>
    </CardContainer>
  );
};

export default Salary;
