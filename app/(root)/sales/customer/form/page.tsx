import CardContainer from "@/components/cards/CardContainer";
import CategoryForm from "@/components/forms/CategoryForm";
import ROUTES from "@/constants/routes";
import { IoCaretBackOutline } from "react-icons/io5";

const page = () => {
  return (
    <CardContainer
      title="Add Category"
      redirectTitle="BACK"
      redirectHref={ROUTES.CATEGORIES}
      redirectIcon={IoCaretBackOutline}
      redirectClass="background-light800_dark300 text-light400_light500"
    >
      <CategoryForm />
    </CardContainer>
  );
};
export default page;
