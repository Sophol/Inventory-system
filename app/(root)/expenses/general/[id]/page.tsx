import { notFound, redirect } from "next/navigation";
import { IoCaretBackOutline } from "react-icons/io5";

import CardContainer from "@/components/cards/CardContainer";
import GeneralExpForm from "@/components/forms/GeneralExpForm";
import ROUTES from "@/constants/routes";
import { getGeneralExp } from "@/lib/actions/generalExp.action";
import { checkAuthorization } from "@/lib/auth";

const EditGeneralExp = async ({ params }: RouteParams) => {
  const isAuthorized = await checkAuthorization(["admin", "branch"]);
  if (!isAuthorized) {
    return redirect("/unauthorized");
  }
  const { id } = await params;
  if (!id) return notFound();
  const { data: generalExp, success } = await getGeneralExp({
    generalExpId: id,
  });
  if (!success) return notFound();

  return (
    <CardContainer
      title="generalExpense"
      redirectTitle="back"
      redirectHref={ROUTES.GENERALEXPS}
      redirectIcon={IoCaretBackOutline}
      redirectClass="background-light800_dark300 text-light400_light500"
    >
      <GeneralExpForm generalExp={generalExp!} isEdit />
    </CardContainer>
  );
};

export default EditGeneralExp;
