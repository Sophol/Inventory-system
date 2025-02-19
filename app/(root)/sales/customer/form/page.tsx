import { IoCaretBackOutline } from "react-icons/io5";

import CardContainer from "@/components/cards/CardContainer";
import CustomerForm from "@/components/forms/CustomerForm";
import ROUTES from "@/constants/routes";

const page = () => {
  return (
    <CardContainer
      title="customer"
      redirectTitle="back"
      redirectHref={ROUTES.CUSTOMERS}
      redirectIcon={IoCaretBackOutline}
      redirectClass="background-light800_dark300 text-light400_light500"
    >
      <CustomerForm />
    </CardContainer>
  );
};

export default page;
