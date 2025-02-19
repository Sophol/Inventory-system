import React from "react";
import { CiCirclePlus } from "react-icons/ci";

import { SupplierColumn } from "@/columns/SupplierColumn";
import CardContainer from "@/components/cards/CardContainer";
import DataRenderer from "@/components/DataRenderer";
import LocalSearch from "@/components/search/LocalSearch";
import { DataTable } from "@/components/table/DataTable";
import ROUTES from "@/constants/routes";
import { SUPPLIER_EMPTY } from "@/constants/states";
import { getSuppliers } from "@/lib/actions/supplier.action";
import { checkAuthorization } from "@/lib/auth";
import { redirect } from "next/navigation";

interface SearchParams {
  searchParams: Promise<{ [key: string]: string }>;
}

const Supplier = async ({ searchParams }: SearchParams) => {
  const isAuthorized = await checkAuthorization(["admin", "branch", "stock"]);
  if (!isAuthorized) {
    return redirect("/unauthorized");
  }
  const { page, pageSize, query, filter } = await searchParams;
  const { success, data, error } = await getSuppliers({
    page: Number(page) || 1,
    pageSize: Number(pageSize) || 10,
    query: query || "",
    filter: filter || "",
  });
  const { suppliers, totalCount, isNext } = data || {};
  return (
    <CardContainer
      title="supplier"
      redirectTitle="add"
      redirectHref={ROUTES.ADDSUPPLIER}
      redirectIcon={CiCirclePlus}
      redirectClass="!text-light-900 primary-gradient"
    >
      <>
        <div className="pb-4">
          <LocalSearch route={ROUTES.SUPPLIERS} placeholder="Search..." />
        </div>
        <DataRenderer
          success={success}
          error={error}
          data={suppliers}
          empty={SUPPLIER_EMPTY}
          render={() => (
            <DataTable
              columns={SupplierColumn}
              data={suppliers!}
              isNext={isNext}
              totalCount={totalCount}
            />
          )}
        />
      </>
    </CardContainer>
  );
};

export default Supplier;
