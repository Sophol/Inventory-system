import CardContainer from "@/components/cards/CardContainer";
import UnitForm from "@/components/forms/UnitForm";
import ROUTES from "@/constants/routes";
import { getUnit } from "@/lib/actions/unit.action";
import { checkAuthorization } from "@/lib/auth";
import { notFound, redirect } from "next/navigation";
import { IoCaretBackOutline } from "react-icons/io5";

const EditUnit = async ({ params }: RouteParams) => {
  const isAuthorized = await checkAuthorization(["admin", "branch", "stock"]);
  if (!isAuthorized) {
    return redirect("/unauthorized");
  }
  const { id } = await params;
  if (!id) return notFound();
  const { data: unit, success } = await getUnit({ unitId: id });
  if (!success) return notFound();

  return (
    <CardContainer
      title="Add Category"
      redirectTitle="BACK"
      redirectHref={ROUTES.UNITS}
      redirectIcon={IoCaretBackOutline}
      redirectClass="background-light800_dark300 text-light400_light500"
    >
      <UnitForm unit={unit} isEdit />
    </CardContainer>
  );
};
export default EditUnit;
