import { IoCaretBackOutline } from "react-icons/io5";

import CardContainer from "@/components/cards/CardContainer";
import UserForm from "@/components/forms/UserForm";
import ROUTES from "@/constants/routes";

const page = () => {
  return (
    <CardContainer
      title="Add User"
      redirectTitle="BACK"
      redirectHref={ROUTES.USERS}
      redirectIcon={IoCaretBackOutline}
      redirectClass="background-light800_dark300 text-light400_light500"
    >
      <UserForm />
    </CardContainer>
  );
};

export default page;
