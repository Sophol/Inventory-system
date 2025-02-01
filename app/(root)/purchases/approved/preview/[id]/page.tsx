import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import ROUTES from "@/constants/routes";
import { checkAuthorization } from "@/lib/auth";
import { getPurchase } from "@/lib/actions/purchase.action";
import PurchaseDetail from "./components/PurchaseDetail";

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

  return <PurchaseDetail purchase={purchase} />;
};

export default PreviewPurchase;
