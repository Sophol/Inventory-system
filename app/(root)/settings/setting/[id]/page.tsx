import { notFound, redirect } from "next/navigation";
import { IoCaretBackOutline } from "react-icons/io5";

import CardContainer from "@/components/cards/CardContainer";
import SettingForm from "@/components/forms/SettingForm";
import ROUTES from "@/constants/routes";
import { getSetting } from "@/lib/actions/setting.action";
import { checkAuthorization } from "@/lib/auth";

const EditSetting = async ({ params }: RouteParams) => {
  const isAuthorized = await checkAuthorization([
    "admin",
    "branch",
    "stock",
    "seller",
  ]);
  if (!isAuthorized) {
    return redirect("/unauthorized");
  }
  const { id } = await params;
  if (!id) return notFound();
  const { data, success } = await getSetting({ settingId: id });
  if (!success || !data) return notFound();
  const setting = data;

  return (
    <CardContainer
      title="settings"
      redirectTitle="back"
      redirectHref={ROUTES.SETTING(id)}
      redirectIcon={IoCaretBackOutline}
      redirectClass="background-light800_dark300 text-light400_light500"
    >
      <SettingForm setting={setting} isEdit />
    </CardContainer>
  );
};

export default EditSetting;
