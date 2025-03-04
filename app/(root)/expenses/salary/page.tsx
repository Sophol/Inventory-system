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
import { formatCurrency } from "@/lib/utils";
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
      summary: {
        count: 0;
        totalAmount: 0;
        totalAllowance: 0;
        totalDeduction: 0;
        totalSalary: 0;
      };
      isNext: boolean;
    });
  const summaryRow = (
    <TableRow className="bg-blue-200 dark:bg-slate-800">
      <TableCell colSpan={3} className="text-right ">
        <strong className="px-4">Total:</strong>
      </TableCell>
      <TableCell className="text-right ">
        <strong className="px-4">{formatCurrency(summary?.totalSalary)}</strong>
      </TableCell>
      <TableCell className="text-right ">
        <strong className="px-4">
          {formatCurrency(summary?.totalAllowance)}
        </strong>
      </TableCell>
      <TableCell className="text-right ">
        <strong className="px-4">
          {formatCurrency(summary?.totalDeduction)}
        </strong>
      </TableCell>
      <TableCell className="text-right ">
        <strong className="px-4">{formatCurrency(summary?.totalAmount)}</strong>
      </TableCell>
      <TableCell></TableCell>
    </TableRow>
  );
  return (
    <CardContainer
      title="salary"
      redirectTitle="add"
      redirectHref={ROUTES.ADDSALARYEXP}
      redirectIcon={CiCirclePlus}
      redirectClass="!text-light-900 primary-gradient"
    >
      <>
        <div className="pb-4">
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
              totalCount={summary.count}
            />
          )}
        />
      </>
    </CardContainer>
  );
};

export default Salary;
