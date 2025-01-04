import React from "react";
import { CiCirclePlus } from "react-icons/ci";

import CardContainer from "@/components/cards/CardContainer";
import DataRenderer from "@/components/DataRenderer";
import LocalSearch from "@/components/search/LocalSearch";
import { DataTable } from "@/components/table/DataTable";
import ROUTES from "@/constants/routes";
import { SALARY_EMPTY } from "@/constants/states";
import { getSalaries } from "@/lib/actions/salary.action";
import { checkAuthorization } from "@/lib/auth";
import { redirect } from "next/navigation";
import { SalaryColumn } from "@/columns/SalaryColumn";

interface SearchParams {
  searchParams: Promise<{ [key: string]: string }>;
}

const Salary = async ({ searchParams }: SearchParams) => {
  const isAuthorized = await checkAuthorization(["admin", "branch"]);
  if (!isAuthorized) {
    return redirect("/unauthorized");
  }
  const { page, pageSize, query, filter } = await searchParams;
  const { success, data, error } = await getSalaries({
    page: Number(page) || 1,
    pageSize: Number(pageSize) || 10,
    query: query || "",
    filter: filter || "",
  });
  const { salaries, isNext } =
    data || ({} as { salaries: Salary[]; isNext: boolean });
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
          <LocalSearch route={ROUTES.SALARYEXPS} placeholder="Search..." />
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
              isNext={isNext}
            />
          )}
        />
      </>
    </CardContainer>
  );
};

export default Salary;
