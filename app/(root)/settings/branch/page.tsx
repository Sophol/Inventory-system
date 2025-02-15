import { redirect } from "next/navigation";
import React from "react";
import { CiCirclePlus } from "react-icons/ci";

import { BranchColumn } from "@/columns/BranchColumn";
import CardContainer from "@/components/cards/CardContainer";
import DataRenderer from "@/components/DataRenderer";
import LocalSearch from "@/components/search/LocalSearch";
import { DataTable } from "@/components/table/DataTable";
import ROUTES from "@/constants/routes";
import { BRANCH_EMPTY } from "@/constants/states";
import { getBranches } from "@/lib/actions/branch.action";
import { checkAuthorization } from "@/lib/auth";

interface SearchParams {
  searchParams: Promise<{ [key: string]: string }>;
}

const Branch = async ({ searchParams }: SearchParams) => {
  const isAuthorized = await checkAuthorization([
    "admin",
    "branch",
    "stock",
    "seller",
  ]);
  if (!isAuthorized) {
    return redirect("/unauthorized");
  }
  const { page, pageSize, query, filter } = await searchParams;
  const { success, data, error } = await getBranches({
    page: Number(page) || 1,
    pageSize: Number(pageSize) || 10,
    query: query || "",
    filter: filter || "",
  });
  const { branches, totalCount, isNext } = data || {};
  return (
    <CardContainer
      title="branch"
      redirectTitle="add"
      redirectHref={ROUTES.ADDBRANCH}
      redirectIcon={CiCirclePlus}
      redirectClass="!text-light-900 primary-gradient"
    >
      <>
        <div className="py-4">
          <LocalSearch route={ROUTES.BRANCHES} placeholder="search..." />
        </div>
        <DataRenderer
          success={success}
          error={error}
          data={branches}
          empty={BRANCH_EMPTY}
          render={() => (
            <DataTable
              columns={BranchColumn}
              data={branches!}
              isNext={isNext}
              totalCount={totalCount}
            />
          )}
        />
      </>
    </CardContainer>
  );
};

export default Branch;
