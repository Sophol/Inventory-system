import React from "react";
import { CiCirclePlus } from "react-icons/ci";

import CardContainer from "@/components/cards/CardContainer";
import DataRenderer from "@/components/DataRenderer";
import LocalSearch from "@/components/search/LocalSearch";
import { DataTable } from "@/components/table/DataTable";
import ROUTES from "@/constants/routes";
import { MISSION_EMPTY } from "@/constants/states";
import { getMissions } from "@/lib/actions/mission.action";
import { checkAuthorization } from "@/lib/auth";
import { redirect } from "next/navigation";
import { MissionColumn } from "@/columns/MissionColumn";

interface SearchParams {
  searchParams: Promise<{ [key: string]: string }>;
}

const Mission = async ({ searchParams }: SearchParams) => {
  const isAuthorized = await checkAuthorization(["admin", "branch"]);
  if (!isAuthorized) {
    return redirect("/unauthorized");
  }
  const { page, pageSize, query, filter } = await searchParams;
  const { success, data, error } = await getMissions({
    page: Number(page) || 1,
    pageSize: Number(pageSize) || 10,
    query: query || "",
    filter: filter || "",
  });
  const { missions, isNext } =
    data || ({} as { missions: Mission[]; isNext: boolean });
  return (
    <CardContainer
      title="Mission"
      redirectTitle="ADD"
      redirectHref={ROUTES.ADDMISSIONEXP}
      redirectIcon={CiCirclePlus}
      redirectClass="!text-light-900 primary-gradient"
    >
      <>
        <div className="py-4">
          <LocalSearch route={ROUTES.MISSIONEXPS} placeholder="Search..." />
        </div>
        <DataRenderer
          success={success}
          error={error}
          data={missions}
          empty={MISSION_EMPTY}
          render={() => (
            <DataTable
              columns={MissionColumn}
              data={missions!}
              isNext={isNext}
            />
          )}
        />
      </>
    </CardContainer>
  );
};

export default Mission;
