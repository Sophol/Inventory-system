import { notFound, redirect } from "next/navigation";
import { IoCaretBackOutline } from "react-icons/io5";

import CardContainer from "@/components/cards/CardContainer";
import CustomerForm from "@/components/forms/CustomerForm";
import ROUTES from "@/constants/routes";
import { getCustomer } from "@/lib/actions/customer.action";
import { checkAuthorization } from "@/lib/auth";

const EditCustomer = async ({ params }: RouteParams) => {
  const isAuthorized = await checkAuthorization(["admin", "branch", "seller"]);
  if (!isAuthorized) {
    return redirect("/unauthorized");
  }
  const { id } = await params;
  if (!id) return notFound();
  const { data: customer, success } = await getCustomer({ customerId: id });
  if (!success) return notFound();

  return (
    <CardContainer
      title="customer"
      redirectTitle="back"
      redirectHref={ROUTES.CUSTOMERS}
      redirectIcon={IoCaretBackOutline}
      redirectClass="background-light800_dark300 text-light400_light500"
    >
      <CustomerForm customer={customer} isEdit />
    </CardContainer>
  );
};

export default EditCustomer;
