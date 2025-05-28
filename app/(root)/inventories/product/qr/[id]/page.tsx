import CardContainer from "@/components/cards/CardContainer";
import GenerateSerialForm from "@/components/forms/GenerateSerialForm";
import ROUTES from "@/constants/routes";
import { getProduct } from "@/lib/actions/product.action";
import { checkAuthorization } from "@/lib/auth";
import { notFound, redirect } from "next/navigation";
import { IoCaretBackOutline } from "react-icons/io5";

const ProductQr = async ({ params }: RouteParams) => {
  const isAuthorized = await checkAuthorization(["admin", "branch", "stock"]);
  if (!isAuthorized) {
    return redirect("/unauthorized");
  }
  const { id } = await params;
  if (!id) return notFound();
  const { data: product, success } = await getProduct({ productId: id });
  if (!success || !product) return notFound();
  return (
    <CardContainer
      title="product"
      redirectTitle="back"
      redirectHref={ROUTES.PRODUCTS}
      redirectIcon={IoCaretBackOutline}
      redirectClass="background-light800_dark300 text-light400_light500"
    >
      <GenerateSerialForm product={product} />
    </CardContainer>
  );
};
export default ProductQr;
