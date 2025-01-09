import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import ROUTES from "@/constants/routes";
import { getSale } from "@/lib/actions/sale.action";
import { getSetting } from "@/lib/actions/setting.action";
import Invoice from "./components/Invoice";
import { checkAuthorization } from "@/lib/auth";

const InvoiceDetailPage = async ({ params }: RouteParams) => {
  const isAuthorized = await checkAuthorization(["admin", "branch", "seller"]);
  if (!isAuthorized) {
    return redirect("/unauthorized");
  }
  const { id } = await params;
  if (!id) return notFound();
  const session = await auth();
  if (!session) return redirect(ROUTES.SIGN_IN);
  const { data: invoice, success: invoiceSuccess } = await getSale({
    saleId: id,
  });
  if (!invoiceSuccess || !invoice) return notFound();
  const { data: setting, success: settingSuccess } = await getSetting({
    settingId: process.env.SETTING_ID as string,
  });
  if (!settingSuccess || !setting) return notFound();

  return <Invoice invoice={invoice} setting={setting} />;
};

export default InvoiceDetailPage;
