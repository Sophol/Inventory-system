import { notFound, redirect } from "next/navigation";
import { IoCaretBackOutline } from "react-icons/io5";

import CardContainer from "@/components/cards/CardContainer";
import ROUTES from "@/constants/routes";
import { getCustomer } from "@/lib/actions/customer.action";
import { checkAuthorization } from "@/lib/auth";
import ContactAction from "./ContractAction";
import ContractDetail from "./ContractDetail";

const EditCustomer = async ({ params }: RouteParams) => {
  const isAuthorized = await checkAuthorization(["admin", "branch", "seller"]);
  if (!isAuthorized) {
    return redirect("/unauthorized");
  }
  const { id } = await params;
  if (!id) return notFound();
  const { data: customer, success } = await getCustomer({ customerId: id });
  if (!success) return notFound();
  if (!customer) return notFound();
  return (
    <CardContainer
      title="Customer Contract"
      redirectTitle="BACK"
      redirectHref={ROUTES.CUSTOMERS}
      redirectIcon={IoCaretBackOutline}
      redirectClass="background-light800_dark300 text-light400_light500"
    >


      <div className="flex gap-4 invoice-container">
        <ContractDetail customer={customer} />
        <ContactAction  />
      </div>

    </CardContainer>
  );
};

export default EditCustomer;
