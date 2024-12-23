import { auth } from "@/auth";
import CardContainer from "@/components/cards/CardContainer";
import UnitForm from "@/components/forms/UnitForm";
import ROUTES from "@/constants/routes";
import { getUnit } from "@/lib/actions/unit.action";
import { notFound, redirect } from "next/navigation";
import { IoCaretBackOutline } from "react-icons/io5";

const EditUnit = async ({ params }: RouteParams) => {
  const { id } = await params;
  if (!id) return notFound();
  const session = await auth();
  if (!session) return redirect(ROUTES.SIGN_IN);
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
