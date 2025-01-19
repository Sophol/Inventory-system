import React from "react";
import { CiCirclePlus } from "react-icons/ci";

import CardContainer from "@/components/cards/CardContainer";
import DataRenderer from "@/components/DataRenderer";
import { DataTable } from "@/components/table/DataTable";
import ROUTES from "@/constants/routes";
import { MISSION_EMPTY } from "@/constants/states";
import { getMissions } from "@/lib/actions/mission.action";
import { checkAuthorization } from "@/lib/auth";
import { redirect } from "next/navigation";
import { MissionColumn } from "@/columns/MissionColumn";
import { ColumnDef } from "@tanstack/react-table";
import { TableCell, TableRow } from "@/components/ui/table";
import GeneralExpSearch from "@/components/search/GeneralExpSearch";

interface SearchParams {
  searchParams: Promise<{ [key: string]: string }>;
}

const Mission = async ({ searchParams }: SearchParams) => {
  const isAuthorized = await checkAuthorization(["admin", "branch"]);
  if (!isAuthorized) {
    return redirect("/unauthorized");
  }
  const { page, pageSize, query, filter, branchId, dateRange } =
    await searchParams;
  const { success, data, error } = await getMissions({
    page: Number(page) || 1,
    pageSize: Number(pageSize) || 10,
    query: query || "",
    filter: filter || "",
    branchId: branchId?.toString() || "",
    dateRange: dateRange?.toString() || "",
  });
  const { missions, summary, isNext } =
    data ||
    ({} as {
      missions: Mission[];
      summary: { count: 0; totalAmount: 0 };
      isNext: boolean;
    });
  const summaryRow = (
    <TableRow>
      <TableCell colSpan={3} className="text-right">
        <strong>Total:</strong>
      </TableCell>
      <TableCell>
        <strong>{summary?.totalAmount}</strong>
      </TableCell>
    </TableRow>
  );
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
          <GeneralExpSearch route={ROUTES.MISSIONEXPS} />
        </div>
        <DataRenderer
          success={success}
          error={error}
          data={missions}
          empty={MISSION_EMPTY}
          render={() => (
            <DataTable
              columns={MissionColumn as ColumnDef<Mission, unknown>[]}
              data={missions!}
              summaryRow={summaryRow}
              isNext={isNext}
            />
          )}
        />
      </>
    </CardContainer>
  );
};

export default Mission;
