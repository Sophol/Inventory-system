import { notFound, redirect } from "next/navigation";
import { IoCaretBackOutline } from "react-icons/io5";

import CardContainer from "@/components/cards/CardContainer";
import BranchForm from "@/components/forms/BranchForm";
import ROUTES from "@/constants/routes";
import { getBranch } from "@/lib/actions/branch.action";
import { checkAuthorization } from "@/lib/auth";

const EditBranch = async ({ params }: RouteParams) => {
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
  const { data: branch, success } = await getBranch({ branchId: id });
  if (!success) return notFound();

  return (
    <CardContainer
      title="Edit Branch"
      redirectTitle="BACK"
      redirectHref={ROUTES.BRANCHES}
      redirectIcon={IoCaretBackOutline}
      redirectClass="background-light800_dark300 text-light400_light500"
    >
      <BranchForm branch={branch} isEdit />
    </CardContainer>
  );
};

export default EditBranch;
