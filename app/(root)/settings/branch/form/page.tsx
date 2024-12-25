import { IoCaretBackOutline } from "react-icons/io5";

import CardContainer from "@/components/cards/CardContainer";
import BranchForm from "@/components/forms/BranchForm";
import ROUTES from "@/constants/routes";

const page = () => {
  return (
    <CardContainer
      title="Add Branch"
      redirectTitle="BACK"
      redirectHref={ROUTES.BRANCHES}
      redirectIcon={IoCaretBackOutline}
      redirectClass="background-light800_dark300 text-light400_light500"
    >
      <BranchForm />
    </CardContainer>
  );
};

export default page;
