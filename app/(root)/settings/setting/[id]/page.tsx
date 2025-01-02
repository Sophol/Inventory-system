import { notFound, redirect } from "next/navigation";
import { IoCaretBackOutline } from "react-icons/io5";

import { auth } from "@/auth";
import CardContainer from "@/components/cards/CardContainer";
import ROUTES from "@/constants/routes";
import SettingForm from "@/components/forms/SettingForm";
import { getSetting } from "@/lib/actions/setting.action";

const EditSetting = async ({ params }: RouteParams) => {
  const { id } = await params;
  if (!id) return notFound();
  const session = await auth();
  if (!session) return redirect(ROUTES.SIGN_IN);
  const { data, success } = await getSetting({ settingId: id });
  if (!success || !data) return notFound();
  const setting = data;

  return (
    <CardContainer
      title="Edit Setting"
      redirectTitle="BACK"
      redirectHref={ROUTES.SETTING(id)}
      redirectIcon={IoCaretBackOutline}
      redirectClass="background-light800_dark300 text-light400_light500"
    >
      <SettingForm setting={setting} isEdit />
    </CardContainer>
  );
};

export default EditSetting;
