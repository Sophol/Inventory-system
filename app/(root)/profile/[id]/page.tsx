import { notFound } from "next/navigation";
import { IoCaretBackOutline } from "react-icons/io5";

import CardContainer from "@/components/cards/CardContainer";
import ROUTES from "@/constants/routes";
import { api } from "@/lib/api";
import ProfileForm from "@/components/forms/ProfileForm";

const Profile = async ({ params }: RouteParams) => {
  const { id } = await params;
  if (!id) return notFound();

  const { data, success } = await api.users.getById(id);
  const user = data as User;

  if (!success) return notFound();

  return (
    <CardContainer
      title="user"
      redirectTitle=""
      redirectHref={ROUTES.USERS}
      redirectIcon={IoCaretBackOutline}
      isButton={false}
      redirectClass="background-light800_dark300 text-light400_light500"
    >
      <ProfileForm user={user} isEdit />
    </CardContainer>
  );
};

export default Profile;
