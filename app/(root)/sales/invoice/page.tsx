import React from "react";

import { SaleColumn } from "@/columns/OrderCompleteColumn";
import CardContainer from "@/components/cards/CardContainer";
import DataRenderer from "@/components/DataRenderer";
import LocalSearch from "@/components/search/LocalSearch";
import { DataTable } from "@/components/table/DataTable";
import ROUTES from "@/constants/routes";
import { SALE_EMPTY } from "@/constants/states";
import { getOrders } from "@/lib/actions/sale.action";
import { CiCirclePlus } from "react-icons/ci";
import { checkAuthorization } from "@/lib/auth";
import { redirect } from "next/navigation";

interface SearchParams {
  searchParams: Promise<{ [key: string]: string }>;
}

const CompleteOrder = async ({ searchParams }: SearchParams) => {
  const isAuthorized = await checkAuthorization(["admin", "branch", "seller"]);
  if (!isAuthorized) {
    return redirect("/unauthorized");
  }
  const { page, pageSize, query, filter } = await searchParams;
  const { success, data, error } = await getOrders({
    orderStatus: "completed",
    page: Number(page) || 1,
    pageSize: Number(pageSize) || 10,
    query: query || "",
    filter: filter || "",
  });
  const { sales, isNext } = data || ({} as { sales: Sale[]; isNext: boolean });
  return (
    <CardContainer
      title="Invoice"
      redirectTitle="ADD"
      redirectHref={ROUTES.ADDINVOICE}
      redirectIcon={CiCirclePlus}
      redirectClass="!text-light-900 primary-gradient"
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
            <DataTable columns={SaleColumn} data={sales!} isNext={isNext} />
          )}
        />
      </>
    </CardContainer>
  );
};

export default CompleteOrder;
