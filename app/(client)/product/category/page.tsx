import ProductCard from "@/components/clients/ProductCard";
import DataRenderer from "@/components/DataRenderer";
import Pagination from "@/components/Pagination";
import { PRODUCT_EMPTY } from "@/constants/states";
import { getProductClients } from "@/lib/actions/product.action";

interface SearchParams {
  searchParams: Promise<{ [key: string]: string }>;
}

const ProductByCategory = async ({ searchParams }: SearchParams) => {
  const { page, pageSize, query, filter, categoryId } = await searchParams;
  const { success, data, error } = await getProductClients({
    page: Number(page) || 1,
    pageSize: Number(pageSize) || 10,
    query: query || "",
    filter: filter || "",
    categoryId: categoryId || "",
  });
  const { products, isNext } = data || {};
  return (
    <>
      <div className="px-6 md:px-16 lg:px-32">
        <div className="flex flex-col items-center pt-14">
          <p className="text-2xl font-medium text-left w-full">All products</p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 flex-col items-center gap-6 mt-6 pb-14 w-full">
            <DataRenderer
              data={products}
              error={error}
              success={success}
              empty={PRODUCT_EMPTY}
              render={(products) =>
                products.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))
              }
            />
          </div>
          <Pagination page={page} isNext={isNext || false} />
        </div>
      </div>
    </>
  );
};
export default ProductByCategory;
