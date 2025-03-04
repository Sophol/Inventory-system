import { redirect } from "next/navigation";
import { IoCaretBackOutline } from "react-icons/io5";

import CardContainer from "@/components/cards/CardContainer";
import UserForm from "@/components/forms/UserForm";
import ROUTES from "@/constants/routes";
import { checkAuthorization } from "@/lib/auth";

const CreateUser = async () => {
  const isAuthorized = await checkAuthorization(["admin", "branch"]);
  if (!isAuthorized) {
    return redirect("/unauthorized");
  }
  return (
    <CardContainer
      title="user"
      redirectTitle="back"
      redirectHref={ROUTES.USERS}
      redirectIcon={IoCaretBackOutline}
      redirectClass="background-light800_dark300 text-light400_light500"
    >
      <UserForm />
    </CardContainer>
  );
};

export default CreateUser;
