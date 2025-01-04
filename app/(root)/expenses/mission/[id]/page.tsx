import { notFound, redirect } from "next/navigation";
import { IoCaretBackOutline } from "react-icons/io5";

import CardContainer from "@/components/cards/CardContainer";
import MissionForm from "@/components/forms/MissionForm";
import ROUTES from "@/constants/routes";
import { getMission } from "@/lib/actions/mission.action";
import { checkAuthorization } from "@/lib/auth";

const EditMission = async ({ params }: RouteParams) => {
  const isAuthorized = await checkAuthorization(["admin", "branch"]);
  if (!isAuthorized) {
    return redirect("/unauthorized");
  }
  const { id } = await params;
  if (!id) return notFound();
  const { data: mission, success } = await getMission({ missionId: id });
  if (!success) return notFound();

  return (
    <CardContainer
      title="Edit Mission"
      redirectTitle="BACK"
      redirectHref={ROUTES.MISSIONEXPS}
      redirectIcon={IoCaretBackOutline}
      redirectClass="background-light800_dark300 text-light400_light500"
    >
      <MissionForm mission={mission!} isEdit />
    </CardContainer>
  );
};

export default EditMission;
