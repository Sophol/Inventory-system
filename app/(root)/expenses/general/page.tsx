import React from "react";
import { CiCirclePlus } from "react-icons/ci";

import CardContainer from "@/components/cards/CardContainer";
import DataRenderer from "@/components/DataRenderer";
import LocalSearch from "@/components/search/LocalSearch";
import { DataTable } from "@/components/table/DataTable";
import ROUTES from "@/constants/routes";
import { GENERALEXP_EMPTY } from "@/constants/states";
import { getGeneralExps } from "@/lib/actions/generalExp.action";
import { checkAuthorization } from "@/lib/auth";
import { redirect } from "next/navigation";
import { GeneralExpColumn } from "@/columns/GeneralExpColumn";

interface SearchParams {
  searchParams: Promise<{ [key: string]: string }>;
}

const GeneralExp = async ({ searchParams }: SearchParams) => {
  const isAuthorized = await checkAuthorization(["admin", "branch"]);
  if (!isAuthorized) {
    return redirect("/unauthorized");
  }
  const { page, pageSize, query, filter } = await searchParams;
  const { success, data, error } = await getGeneralExps({
    page: Number(page) || 1,
    pageSize: Number(pageSize) || 10,
    query: query || "",
    filter: filter || "",
  });
  const { generalExps, isNext } =
    data || ({} as { generalExps: GeneralExp[]; isNext: boolean });
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
          <LocalSearch route={ROUTES.GENERALEXPS} placeholder="Search..." />
        </div>
        <DataRenderer
          success={success}
          error={error}
          data={generalExps}
          empty={GENERALEXP_EMPTY}
          render={() => (
            <DataTable
              columns={GeneralExpColumn}
              data={generalExps!}
              isNext={isNext}
            />
          )}
        />
      </>
    </CardContainer>
  );
};

export default GeneralExp;
