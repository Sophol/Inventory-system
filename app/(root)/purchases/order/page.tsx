import React from "react";
import { CiCirclePlus } from "react-icons/ci";

import { PurchaseColumn } from "@/columns/PurchaseColumn";
import CardContainer from "@/components/cards/CardContainer";
import DataRenderer from "@/components/DataRenderer";
import LocalSearch from "@/components/search/LocalSearch";
import { DataTable } from "@/components/table/DataTable";
import ROUTES from "@/constants/routes";
import { PURCHASE_EMPTY } from "@/constants/states";
import { getPurchases } from "@/lib/actions/purchase.action";
import { checkAuthorization } from "@/lib/auth";
import { redirect } from "next/navigation";

interface SearchParams {
  searchParams: Promise<{ [key: string]: string }>;
}

const Purchase = async ({ searchParams }: SearchParams) => {
  const isAuthorized = await checkAuthorization(["admin", "branch", "stock"]);
  if (!isAuthorized) {
    return redirect("/unauthorized");
  }
  const { page, pageSize, query, filter } = await searchParams;
  const { success, data, error } = await getPurchases({
    page: Number(page) || 1,
    pageSize: Number(pageSize) || 10,
    query: query || "",
    filter: filter || "",
  });
  const { purchases, isNext } =
    data || ({} as { purchases: Purchase[]; isNext: boolean });
  return (
    <CardContainer
      title="Purchase"
      redirectTitle="ADD"
      redirectHref={ROUTES.ADDPURCHASE}
      redirectIcon={CiCirclePlus}
      redirectClass="!text-light-900 primary-gradient"
    >
      <>
        <div className="py-4">
          <LocalSearch route={ROUTES.PURCHASES} placeholder="Search..." />
        </div>
        <DataRenderer
          success={success}
          error={error}
          data={purchases}
          empty={PURCHASE_EMPTY}
          render={() => (
            <DataTable
              columns={PurchaseColumn}
              data={purchases!}
              isNext={isNext}
            />
          )}
        />
      </>
    </CardContainer>
  );
};

export default Purchase;
