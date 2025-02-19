import { notFound, redirect } from "next/navigation";
import { IoCaretBackOutline } from "react-icons/io5";

import CardContainer from "@/components/cards/CardContainer";
import SupplierForm from "@/components/forms/SupplierForm";
import ROUTES from "@/constants/routes";
import { getSupplier } from "@/lib/actions/supplier.action";
import { checkAuthorization } from "@/lib/auth";

const EditSupplier = async ({ params }: RouteParams) => {
  const isAuthorized = await checkAuthorization(["admin", "branch", "stock"]);
  if (!isAuthorized) {
    return redirect("/unauthorized");
  }
  const { id } = await params;
  if (!id) return notFound();
  const { data: supplier, success } = await getSupplier({ supplierId: id });
  if (!success) return notFound();

  return (
    <CardContainer
      title="supplier"
      redirectTitle="back"
      redirectHref={ROUTES.SUPPLIERS}
      redirectIcon={IoCaretBackOutline}
      redirectClass="background-light800_dark300 text-light400_light500"
    >
      <SupplierForm supplier={supplier} isEdit />
    </CardContainer>
  );
};

export default EditSupplier;
