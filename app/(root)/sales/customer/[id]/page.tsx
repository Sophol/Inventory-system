import { notFound, redirect } from "next/navigation";
import { IoCaretBackOutline } from "react-icons/io5";

import { auth } from "@/auth";
import CardContainer from "@/components/cards/CardContainer";
import CustomerForm from "@/components/forms/CustomerForm";
import ROUTES from "@/constants/routes";
import { getCustomer } from "@/lib/actions/customer.action";

const EditCustomer = async ({ params }: RouteParams) => {
  const { id } = await params;
  if (!id) return notFound();
  const session = await auth();
  if (!session) return redirect(ROUTES.SIGN_IN);
  const { data: customer, success } = await getCustomer({ customerId: id });
  if (!success) return notFound();

  return (
    <CardContainer
      title="Edit Customer"
      redirectTitle="BACK"
      redirectHref={ROUTES.CUSTOMERS}
      redirectIcon={IoCaretBackOutline}
      redirectClass="background-light800_dark300 text-light400_light500"
    >
      <CustomerForm customer={customer} isEdit />
    </CardContainer>
  );
};

export default EditCustomer;
