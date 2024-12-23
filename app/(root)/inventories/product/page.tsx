import { ProductColumn } from "@/columns/ProductColumn";
import CardContainer from "@/components/cards/CardContainer";
import DataRenderer from "@/components/DataRenderer";
import LocalSearch from "@/components/search/LocalSearch";
import { DataTable } from "@/components/table/DataTable";
import ROUTES from "@/constants/routes";
import { UNIT_PRODUCT } from "@/constants/states";
import { getProducts } from "@/lib/actions/product.action";
import { CiCirclePlus } from "react-icons/ci";

interface SearchParams {
  searchParams: Promise<{ [key: string]: string }>;
}
const Product = async ({ searchParams }: SearchParams) => {
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
          <LocalSearch route={ROUTES.PRODUCTS} placeholder="Search..." />
        </div>
        <DataRenderer
          success={success}
          error={error}
          data={products}
          empty={UNIT_PRODUCT}
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
export default Product;
