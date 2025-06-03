import { ProductQRColumn } from "@/columns/ProductQRColumn";
import CardContainer from "@/components/cards/CardContainer";
import DataRenderer from "@/components/DataRenderer";
import ProductQRSearch from "@/components/search/ProductQRSearch";
import { DataTable } from "@/components/table/DataTable";
import ROUTES from "@/constants/routes";
import { PRODUCT_EMPTY } from "@/constants/states";
import { getProductQRs } from "@/lib/actions/serialNumber.action";
import { checkAuthorization } from "@/lib/auth";
import { redirect } from "next/navigation";

interface SearchParams {
  searchParams: Promise<{ [key: string]: string }>;
}
const QR = async ({ searchParams }: SearchParams) => {
  const isAuthorized = await checkAuthorization([
    "admin",
    "branch",
    "stock",
    "seller",
  ]);
  if (!isAuthorized) {
    return redirect("/unauthorized");
  }
  const { page, pageSize, query, filter, status, isPrint, generatedYear } =
    await searchParams;
  const { success, error, data } = await getProductQRs({
    page: Number(page) || 1,
    pageSize: Number(pageSize) || 10,
    query,
    filter,
    status: status ? Number(status) : undefined,
    is_printed:
      isPrint === "true" ? true : isPrint === "false" ? false : undefined,
    generated_year: generatedYear ? Number(generatedYear) : undefined,
  });
  const { productQrs, totalCount, isNext } = data || {
    productQrs: [],
    totalCount: 0,
    isNext: false,
  };
  return (
    <CardContainer
      title="product"
      redirectTitle="add"
      redirectHref={ROUTES.ADDPRODUCT}
      isButton={false}
      redirectClass="!text-light-900 primary-gradient"
    >
      <>
        <div className="py-4">
          <ProductQRSearch route={ROUTES.PRODUCTQRS} />
        </div>
        <DataRenderer
          success={success}
          error={error}
          data={productQrs}
          empty={PRODUCT_EMPTY}
          render={() => (
            <DataTable
              columns={ProductQRColumn}
              data={productQrs!}
              isNext={isNext}
              totalCount={totalCount}
            />
          )}
        />
      </>
    </CardContainer>
  );
};

export default QR;
