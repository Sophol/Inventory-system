import { auth } from "@/auth";
import CardContainer from "@/components/cards/CardContainer";
import ProductForm from "@/components/forms/ProductForm";
import ROUTES from "@/constants/routes";
import { getProduct } from "@/lib/actions/product.action";
import { notFound, redirect } from "next/navigation";
import { IoCaretBackOutline } from "react-icons/io5";

const EditCatgory = async ({ params }: RouteParams) => {
  const { id } = await params;
  if (!id) return notFound();
  const session = await auth();
  if (!session) return redirect(ROUTES.SIGN_IN);
  const { data: product, success } = await getProduct({ productId: id });
  if (!success) return notFound();

  return (
    <CardContainer
      title="Add Product"
      redirectTitle="BACK"
      redirectHref={ROUTES.PRODUCTS}
      redirectIcon={IoCaretBackOutline}
      redirectClass="background-light800_dark300 text-light400_light500"
    >
      <ProductForm product={product} isEdit />
    </CardContainer>
  );
};
export default EditCatgory;
