import React from "react";
import { CiCirclePlus } from "react-icons/ci";

import { CustomerColumn } from "@/columns/CustomerColumn";
import CardContainer from "@/components/cards/CardContainer";
import DataRenderer from "@/components/DataRenderer";
import LocalSearch from "@/components/search/LocalSearch";
import { DataTable } from "@/components/table/DataTable";
import ROUTES from "@/constants/routes";
import { CUSTOMER_EMPTY } from "@/constants/states";
import { getCustomers } from "@/lib/actions/customer.action";

interface SearchParams {
  searchParams: Promise<{ [key: string]: string }>;
}

const Customer = async ({ searchParams }: SearchParams) => {
  const { page, pageSize, query, filter } = await searchParams;
  const { success, data, error } = await getCustomers({
    page: Number(page) || 1,
    pageSize: Number(pageSize) || 10,
    query: query || "",
    filter: filter || "",
  });
  const { customers, isNext } = data || {};
  return (
    <CardContainer
      title="Customer"
      redirectTitle="ADD"
      redirectHref={ROUTES.ADDCUSTOMER}
      redirectIcon={CiCirclePlus}
      redirectClass="!text-light-900 primary-gradient"
    >
      <>
        <div className="py-4">
          <LocalSearch route={ROUTES.CUSTOMERS} placeholder="Search..." />
        </div>
        <DataRenderer
          success={success}
          error={error}
          data={customers}
          empty={CUSTOMER_EMPTY}
          render={() => (
            <DataTable
              columns={CustomerColumn}
              data={customers!}
              isNext={isNext}
            />
          )}
        />
      </>
    </CardContainer>
  );
};

export default Customer;
