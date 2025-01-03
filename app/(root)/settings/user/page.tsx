import React from "react";
import { CiCirclePlus } from "react-icons/ci";

import { UserColumn } from "@/columns/UserColumn";
import CardContainer from "@/components/cards/CardContainer";
import DataRenderer from "@/components/DataRenderer";
import LocalSearch from "@/components/search/LocalSearch";
import { DataTable } from "@/components/table/DataTable";
import ROUTES from "@/constants/routes";
import { USER_EMPTY } from "@/constants/states";
import { getUsers } from "@/lib/actions/user.action";
import { checkAuthorization } from "@/lib/auth";
import { redirect } from "next/navigation";

interface SearchParams {
  searchParams: Promise<{ [key: string]: string }>;
}

const User = async ({ searchParams }: SearchParams) => {
  const isAuthorized = await checkAuthorization(["admin", "branch"]);
  if (!isAuthorized) {
    return redirect("/unauthorized");
  }
  const { page, pageSize, query, filter } = await searchParams;
  const { success, data, error } = await getUsers({
    page: Number(page) || 1,
    pageSize: Number(pageSize) || 10,
    query: query || "",
    filter: filter || "",
  });
  const { users, isNext } = data || {};
  return (
    <CardContainer
      title="User"
      redirectTitle="ADD"
      redirectHref={ROUTES.ADDUSER}
      redirectIcon={CiCirclePlus}
      redirectClass="!text-light-900 primary-gradient"
    >
      <>
        <div className="py-4">
          <LocalSearch route={ROUTES.USERS} placeholder="Search..." />
        </div>
        <DataRenderer
          success={success}
          error={error}
          data={users}
          empty={USER_EMPTY}
          render={() => (
            <DataTable columns={UserColumn} data={users!} isNext={isNext} />
          )}
        />
      </>
    </CardContainer>
  );
};

export default User;
