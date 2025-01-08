import { notFound, redirect } from "next/navigation";

import { auth } from "@/auth";

import ROUTES from "@/constants/routes";
import { getSale } from "@/lib/actions/sale.action";

import InvoiceAction from "./components/InvoiceAction";
import InvoiceDetail from "./components/InvoiceDetail";

const InvoiceDetailPage = async ({ params }: RouteParams) => {
  const { id } = await params;
  if (!id) return notFound();
  const session = await auth();
  if (!session) return redirect(ROUTES.SIGN_IN);
  const { data: invoice, success } = await getSale({ saleId: id });
  if (!success) return notFound();
  if (!invoice) return notFound();
  return (
    <div className="flex gap-4 p-7">
      <InvoiceDetail invoice={invoice} />
      <InvoiceAction invoice={invoice} />
    </div>
  );
};

export default InvoiceDetailPage;
