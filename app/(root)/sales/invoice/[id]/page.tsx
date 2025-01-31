import { notFound, redirect } from "next/navigation";
import { getSale } from "@/lib/actions/sale.action";

import InvoiceAction from "./components/InvoiceAction";
import InvoiceDetail from "./components/InvoiceDetail";
import { checkAuthorization } from "@/lib/auth";

const InvoiceDetailPage = async ({ params }: RouteParams) => {
  const isAuthorized = await checkAuthorization(["admin", "branch", "seller"]);
  if (!isAuthorized) {
    return redirect("/unauthorized");
  }
  const { id } = await params;
  if (!id) return notFound();
  const { data: invoice, success } = await getSale({ saleId: id });
  if (!success) return notFound();
  if (!invoice) return notFound();
  return (
    <div className="flex gap-4 invoice-container">
      <InvoiceDetail invoice={invoice} />
      <InvoiceAction invoice={invoice} />
    </div>
  );
};

export default InvoiceDetailPage;
