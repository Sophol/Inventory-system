"use server";
import { CiCirclePlus } from "react-icons/ci";

import CardContainer from "@/components/cards/CardContainer";
import DataRenderer from "@/components/DataRenderer";
import { DataTable } from "@/components/table/DataTable";
import ROUTES from "@/constants/routes";
import { PRODUCT_EMPTY } from "@/constants/states";
import { checkAuthorization } from "@/lib/auth";
import { redirect } from "next/navigation";
import ProductSearch from "@/components/search/ProductSearch";
import { getAlertQtyReports } from "@/lib/actions/productReport";
import { ProductReportColumn } from "@/columns/ProductReportColumn";

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
  const { page, pageSize, query, categoryId, branchId, filter } =
    await searchParams;

  const { success, data, error } = await getAlertQtyReports({
    page: Number(page) || 1,
    pageSize: Number(pageSize) || 10,
    query: query || "",
    filter: filter || "",
    categoryId: categoryId || "", // Add appropriate value or variable
    branchId: branchId || "", // Add appropriate value or variable
  });
  const { products, totalCount, isNext } = data || {};

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
              columns={ProductReportColumn}
              data={products!}
              isNext={isNext}
              totalCount={totalCount}
            />
          )}
        />
      </>
    </CardContainer>
  );
};

export default ProductReport;
