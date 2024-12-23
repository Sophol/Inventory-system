import CardContainer from "@/components/cards/CardContainer";
import UnitForm from "@/components/forms/UnitForm";
import ROUTES from "@/constants/routes";
import { IoCaretBackOutline } from "react-icons/io5";

const CreateUnit = () => {
  return (
    <CardContainer
      title="Add Unit"
      redirectTitle="BACK"
      redirectHref={ROUTES.UNITS}
      redirectIcon={IoCaretBackOutline}
      redirectClass="background-light800_dark300 text-light400_light500"
    >
      <UnitForm />
    </CardContainer>
  );
};
export default CreateUnit;
