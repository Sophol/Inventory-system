import { notFound, redirect } from "next/navigation";
import { IoCaretBackOutline } from "react-icons/io5";

import { auth } from "@/auth";
import CardContainer from "@/components/cards/CardContainer";
import BranchForm from "@/components/forms/BranchForm";
import ROUTES from "@/constants/routes";
import { getBranch } from "@/lib/actions/branch.action";

const EditBranch = async ({ params }: RouteParams) => {
  const { id } = await params;
  if (!id) return notFound();
  const session = await auth();
  if (!session) return redirect(ROUTES.SIGN_IN);
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
