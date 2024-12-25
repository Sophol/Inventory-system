import { notFound, redirect } from "next/navigation";
import { IoCaretBackOutline } from "react-icons/io5";

import { auth } from "@/auth";
import CardContainer from "@/components/cards/CardContainer";
import SupplierForm from "@/components/forms/SupplierForm";
import ROUTES from "@/constants/routes";
import { getSupplier } from "@/lib/actions/supplier.action";

const EditSupplier = async ({ params }: RouteParams) => {
  const { id } = await params;
  if (!id) return notFound();
  const session = await auth();
  if (!session) return redirect(ROUTES.SIGN_IN);
  const { data: supplier, success } = await getSupplier({ supplierId: id });
  if (!success) return notFound();

  return (
    <CardContainer
      title="Edit Supplier"
      redirectTitle="BACK"
      redirectHref={ROUTES.SUPPLIERS}
      redirectIcon={IoCaretBackOutline}
      redirectClass="background-light800_dark300 text-light400_light500"
    >
      <SupplierForm supplier={supplier} isEdit />
    </CardContainer>
  );
};

export default EditSupplier;
