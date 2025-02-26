import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import ROUTES from "@/constants/routes";
import { checkAuthorization } from "@/lib/auth";
import { getPurchase } from "@/lib/actions/purchase.action";
import PurchaseDetail from "./components/PurchaseDetail";
import { getSetting } from "@/lib/actions/setting.action";

const PreviewPurchase = async ({ params }: RouteParams) => {
  const isAuthorized = await checkAuthorization(["admin", "branch", "stock"]);
  if (!isAuthorized) {
    return redirect("/unauthorized");
  }
  const { id } = await params;
  if (!id) return notFound();
  const session = await auth();
  if (!session) return redirect(ROUTES.SIGN_IN);
  const { data: purchase, success: purchaseSuccess } = await getPurchase({
    purchaseId: id,
  });
  if (!purchaseSuccess || !purchase) return notFound();
  const { success, data: setting } = await getSetting({
    settingId: process.env.SETTING_ID as string,
  });
  if (!success) return notFound();
  if (!setting) return notFound();

  return <PurchaseDetail purchase={purchase} setting={setting} />;
};

export default PreviewPurchase;
