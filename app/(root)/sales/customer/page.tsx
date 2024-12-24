import { CustomerColumn } from "@/columns/CustomerColumn";
import { DataTable } from "@/components/table/DataTable";
import { CiCirclePlus } from "react-icons/ci";
import React from "react";
import CardContainer from "@/components/cards/CardContainer";
import { getCustomers } from "@/lib/actions/customer.action";
import DataRenderer from "@/components/DataRenderer";
import { CUSTOMER_EMPTY } from "@/constants/states";
import ROUTES from "@/constants/routes";
import LocalSearch from "@/components/search/LocalSearch";

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
  console.log("customers1", customers, isNext)
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
          {/* <LocalSearch route={ROUTES.CUSTOMERS} placeholder="Search..." /> */}
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
