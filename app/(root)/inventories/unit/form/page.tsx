import CardContainer from "@/components/cards/CardContainer";
import UnitForm from "@/components/forms/UnitForm";
import ROUTES from "@/constants/routes";
import { checkAuthorization } from "@/lib/auth";
import { redirect } from "next/navigation";
import { IoCaretBackOutline } from "react-icons/io5";

const CreateUnit = async () => {
  const isAuthorized = await checkAuthorization(["admin", "branch", "stock"]);
  if (!isAuthorized) {
    return redirect("/unauthorized");
  }
  return (
    <CardContainer
      title="unit"
      redirectTitle="back"
      redirectHref={ROUTES.UNITS}
      redirectIcon={IoCaretBackOutline}
      redirectClass="background-light800_dark300 text-light400_light500"
    >
      <UnitForm />
    </CardContainer>
  );
};
export default CreateUnit;
