import CardContainer from "@/components/cards/CardContainer";
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
      <h1>Hello</h1>
    </CardContainer>
  );
};
export default page;
