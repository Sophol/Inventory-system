import { notFound, redirect } from "next/navigation";
import { IoCaretBackOutline } from "react-icons/io5";

import { auth } from "@/auth";
import CardContainer from "@/components/cards/CardContainer";
import ROUTES from "@/constants/routes";
import { api } from "@/lib/api";
import UserForm from "@/components/forms/UserForm";

const EditUser = async ({ params }: RouteParams) => {
  const { id } = await params;
  if (!id) return notFound();
  const session = await auth();
  if (!session) return redirect(ROUTES.SIGN_IN);
  const { data: user, success } = await api.users.getById(id);
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
