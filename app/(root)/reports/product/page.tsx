"use server";
import { CiCirclePlus } from "react-icons/ci";

import { ProductColumn } from "@/columns/ProductColumn";
import CardContainer from "@/components/cards/CardContainer";
import DataRenderer from "@/components/DataRenderer";
import { DataTable } from "@/components/table/DataTable";
import ROUTES from "@/constants/routes";
import { PRODUCT_EMPTY } from "@/constants/states";
import { getProducts } from "@/lib/actions/product.action";
import { checkAuthorization } from "@/lib/auth";
import { redirect } from "next/navigation";
import ProductSearch from "@/components/search/ProductSearch";

interface SearchParams {
  searchParams: Promise<{ [key: string]: string }>;
}

const ProductReport = async ({ searchParams }: SearchParams) => {
  const isAuthorized = await checkAuthorization([
    "admin",
    "branch",
    "stock",
    "seller",
  ]);
  if (!isAuthorized) {
    return redirect("/unauthorized");
  }
  const { page, pageSize, query, filter } = await searchParams;
  const { success, data, error } = await getProducts({
    page: Number(page) || 1,
    pageSize: Number(pageSize) || 10,
    query: query || "",
    filter: filter || "",
  });
  const { products, isNext } = data || {};

  return (
    <CardContainer
      title="Product"
      redirectTitle="ADD"
      redirectHref={ROUTES.ADDPRODUCT}
      redirectIcon={CiCirclePlus}
      redirectClass="!text-light-900 primary-gradient"
    >
      <>
        <div className="py-4">
          <ProductSearch route={ROUTES.PRODUCTREPORT} />
        </div>
        <DataRenderer
          success={success}
          error={error}
          data={products}
          empty={PRODUCT_EMPTY}
          render={() => (
            <DataTable
              columns={ProductColumn}
              data={products!}
              isNext={isNext}
            />
          )}
        />
      </>
    </CardContainer>
  );
};

export default ProductReport;
