import CardContainer from "@/components/cards/CardContainer";
import ProductForm from "@/components/forms/ProductForm";
import ROUTES from "@/constants/routes";
import { getCategories } from "@/lib/actions/category.action";
import { IoCaretBackOutline } from "react-icons/io5";

const page = () => {
  return (
    <CardContainer
      title="Add Product"
      redirectTitle="BACK"
      redirectHref={ROUTES.PRODUCTS}
      redirectIcon={IoCaretBackOutline}
      redirectClass="background-light800_dark300 text-light400_light500"
    >
      <ProductForm />
    </CardContainer>
  );
};
export default page;
