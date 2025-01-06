import { notFound, redirect } from "next/navigation";
import { IoCaretBackOutline } from "react-icons/io5";

import CardContainer from "@/components/cards/CardContainer";
import UserForm from "@/components/forms/UserForm";
import ROUTES from "@/constants/routes";
import { api } from "@/lib/api";
import { checkAuthorization } from "@/lib/auth";

const EditUser = async ({ params }: RouteParams) => {
  const isAuthorized = await checkAuthorization(["admin", "branch"]);
  if (!isAuthorized) {
    return redirect("/unauthorized");
  }
  const { id } = await params;
  if (!id) return notFound();

  const { data, success } = await api.users.getById(id);
  const user = data as User;
  if (!success) return notFound();

  return (
    <CardContainer
      title="Edit User"
      redirectTitle="BACK"
      redirectHref={ROUTES.USERS}
      redirectIcon={IoCaretBackOutline}
      redirectClass="background-light800_dark300 text-light400_light500"
    >
      <UserForm user={user} isEdit />
    </CardContainer>
  );
};

export default EditUser;
