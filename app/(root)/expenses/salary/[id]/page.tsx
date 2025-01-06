import { notFound, redirect } from "next/navigation";
import { IoCaretBackOutline } from "react-icons/io5";

import CardContainer from "@/components/cards/CardContainer";
import SalaryForm from "@/components/forms/SalaryForm";
import ROUTES from "@/constants/routes";
import { getSalary } from "@/lib/actions/salary.action";
import { checkAuthorization } from "@/lib/auth";

const EditSalary = async ({ params }: RouteParams) => {
  const isAuthorized = await checkAuthorization(["admin", "branch"]);
  if (!isAuthorized) {
    return redirect("/unauthorized");
  }
  const { id } = await params;
  if (!id) return notFound();
  const { data: salary, success } = await getSalary({ salaryId: id });
  if (!success) return notFound();

  return (
    <CardContainer
      title="Edit Salary"
      redirectTitle="BACK"
      redirectHref={ROUTES.BRANCHES}
      redirectIcon={IoCaretBackOutline}
      redirectClass="background-light800_dark300 text-light400_light500"
    >
      <SalaryForm salary={salary!} isEdit />
    </CardContainer>
  );
};

export default EditSalary;
