import { IoCaretBackOutline } from "react-icons/io5";

import CardContainer from "@/components/cards/CardContainer";
import SupplierForm from "@/components/forms/SupplierForm";
import ROUTES from "@/constants/routes";

const page = () => {
  return (
    <CardContainer
      title="Add Supplier"
      redirectTitle="BACK"
      redirectHref={ROUTES.SUPPLIERS}
      redirectIcon={IoCaretBackOutline}
      redirectClass="background-light800_dark300 text-light400_light500"
    >
      <SupplierForm />
    </CardContainer>
  );
};

export default page;
