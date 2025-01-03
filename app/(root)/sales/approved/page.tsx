
import React from "react";
import { CiCirclePlus } from "react-icons/ci";

import { SaleColumn } from "@/columns/OrderApproveColumn";
import CardContainer from "@/components/cards/CardContainer";
import DataRenderer from "@/components/DataRenderer";
import LocalSearch from "@/components/search/LocalSearch";
import { DataTable } from "@/components/table/DataTable";
import ROUTES from "@/constants/routes";
import { SALE_EMPTY } from "@/constants/states";
import { getApprovedOrder } from "@/lib/actions/sale.action";

interface SearchParams {
  searchParams: Promise<{ [key: string]: string }>;
}

const ApprovedOrder = async ({ searchParams }: SearchParams) => {
  const { page, pageSize, query, filter } = await searchParams;
  const { success, data, error } = await getApprovedOrder({
    page: Number(page) || 1,
    pageSize: Number(pageSize) || 10,
    query: query || "",
    filter: filter || "",
  });
  const { sales, isNext } =
    data || ({} as { sales: Sale[]; isNext: boolean });
  return (
    <CardContainer
      title="Approved Order"
      redirectTitle=""
      redirectHref={""}
      redirectIcon={""}
      redirectClass="hidden"
    >
      <>
        <div className="py-4">
          <LocalSearch route={ROUTES.SALES} placeholder="Search..." />
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
              isNext={isNext}
            />
          )}
        />
      </>
    </CardContainer>
  );
};

export default ApprovedOrder;

