import { CategoryColumn } from "@/columns/CategoryColumn";
import { DataTable } from "@/components/table/DataTable";
import { CiCirclePlus } from "react-icons/ci";
import React from "react";
import CardContainer from "@/components/cards/CardContainer";
import { getCategories } from "@/lib/actions/category.action";
import DataRenderer from "@/components/DataRenderer";
import { CATEGORY_EMPTY } from "@/constants/states";
import ROUTES from "@/constants/routes";

interface SearchParams {
  searchParams: Promise<{ [key: string]: string }>;
}

const Category = async ({ searchParams }: SearchParams) => {
  const { page, pageSize, query, filter } = await searchParams;
  const { success, data, error } = await getCategories({
    page: Number(page) || 1,
    pageSize: Number(pageSize) || 10,
    query: query || "",
    filter: filter || "",
  });
  const { categories } = data || {};
  return (
    <CardContainer
      title="Category"
      redirectTitle="ADD"
      redirectHref={ROUTES.ADDCATEGORY}
      redirectIcon={CiCirclePlus}
      redirectClass="!text-light-900 primary-gradient"
    >
      <DataRenderer
        success={success}
        error={error}
        data={categories}
        empty={CATEGORY_EMPTY}
        render={() => <DataTable columns={CategoryColumn} data={categories!} />}
      />
    </CardContainer>
  );
};
export default Category;
