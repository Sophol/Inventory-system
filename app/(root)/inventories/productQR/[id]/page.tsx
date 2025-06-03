import { notFound, redirect } from "next/navigation";
import { IoCaretBackOutline } from "react-icons/io5";

import CardContainer from "@/components/cards/CardContainer";
import ROUTES from "@/constants/routes";
import { checkAuthorization } from "@/lib/auth";
import { getProductQR } from "@/lib/actions/serialNumber.action";
import ProductQRForm from "@/components/forms/ProductQRForm";

const EditProductQR = async ({ params }: RouteParams) => {
  const isAuthorized = await checkAuthorization(["admin", "branch", "stock"]);
  if (!isAuthorized) {
    return redirect("/unauthorized");
  }
  const { id } = await params;
  if (!id) return notFound();
  const { data: productQR, success } = await getProductQR({ productQrId: id });
  if (!success) return notFound();

  return (
    <CardContainer
      title="product-qr"
      redirectTitle="back"
      redirectHref={ROUTES.PRODUCTQRS}
      redirectIcon={IoCaretBackOutline}
      redirectClass="background-light800_dark300 text-light400_light500"
    >
      <ProductQRForm productQR={productQR} isEdit />
    </CardContainer>
  );
};
export default EditProductQR;
