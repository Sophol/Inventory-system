import React from "react";
import { CiCirclePlus } from "react-icons/ci";

import { CategoryColumn } from "@/columns/CategoryColumn";
import CardContainer from "@/components/cards/CardContainer";
import DataRenderer from "@/components/DataRenderer";
import LocalSearch from "@/components/search/LocalSearch";
import { DataTable } from "@/components/table/DataTable";
import ROUTES from "@/constants/routes";
import { CATEGORY_EMPTY } from "@/constants/states";
import { getCategories } from "@/lib/actions/category.action";
import { checkAuthorization } from "@/lib/auth";
import { redirect } from "next/navigation";

interface SearchParams {
  searchParams: Promise<{ [key: string]: string }>;
}

const Category = async ({ searchParams }: SearchParams) => {
  const isAuthorized = await checkAuthorization(["admin", "branch", "stock"]);
  if (!isAuthorized) {
    return redirect("/unauthorized");
  }
  const { page, pageSize, query, filter } = await searchParams;
  const { success, data, error } = await getCategories({
    page: Number(page) || 1,
    pageSize: Number(pageSize) || 10,
    query: query || "",
    filter: filter || "",
  });
  const { categories, isNext } = data || {};
  return (
    <CardContainer
      title="Category"
      redirectTitle="ADD"
      redirectHref={ROUTES.ADDCATEGORY}
      redirectIcon={CiCirclePlus}
      redirectClass="!text-light-900 primary-gradient"
    >
      <>
        <div className="py-4">
          <LocalSearch route={ROUTES.CATEGORIES} placeholder="Search..." />
        </div>
        <DataRenderer
          success={success}
          error={error}
          data={categories}
          empty={CATEGORY_EMPTY}
          render={() => (
            <DataTable
              columns={CategoryColumn}
              data={categories!}
              isNext={isNext}
            />
          )}
        />
      </>
    </CardContainer>
  );
};
export default Category;
