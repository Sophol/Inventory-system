import CardContainer from "@/components/cards/CardContainer";
import ProductForm from "@/components/forms/ProductForm";
import ROUTES from "@/constants/routes";
import { checkAuthorization } from "@/lib/auth";
import { redirect } from "next/navigation";
import { IoCaretBackOutline } from "react-icons/io5";

const page = async () => {
  const isAuthorized = await checkAuthorization(["admin", "branch", "stock"]);
  if (!isAuthorized) {
    return redirect("/unauthorized");
  }
  return (
    <CardContainer
      title="product"
      redirectTitle="back"
      redirectHref={ROUTES.PRODUCTS}
      redirectIcon={IoCaretBackOutline}
      redirectClass="background-light800_dark300 text-light400_light500"
    >
      <ProductForm />
    </CardContainer>
  );
};
export default page;
