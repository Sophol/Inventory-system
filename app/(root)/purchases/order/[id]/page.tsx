import { IoCaretBackOutline } from "react-icons/io5";

import CardContainer from "@/components/cards/CardContainer";
import PurchaseForm from "@/components/forms/PurchaseForm";
import ROUTES from "@/constants/routes";
import { getSetting } from "@/lib/actions/setting.action";

import { notFound, redirect } from "next/navigation";
import { getPurchase } from "@/lib/actions/purchase.action";
import { checkAuthorization } from "@/lib/auth";

const EditPurchase = async ({ params }: RouteParams) => {
  const isAuthorized = await checkAuthorization(["admin", "branch", "stock"]);
  if (!isAuthorized) {
    return redirect("/unauthorized");
  }
  const { id } = await params;
  if (!id) return notFound();
  const { success: settingSuccess, data: setting } = await getSetting({
    settingId: process.env.SETTING_ID as string,
  });
  if (!settingSuccess) return notFound();
  if (!setting) return notFound();
  const { exchangeRateD, exchangeRateT } = setting;
  const { data: purchase, success: purchaseSuccess } = await getPurchase({
    purchaseId: id,
  });
  if (!purchaseSuccess) return notFound();
  return (
    <CardContainer
      title="Add Purchase"
      redirectTitle="BACK"
      redirectHref={ROUTES.PURCHASES}
      redirectIcon={IoCaretBackOutline}
      redirectClass="background-light800_dark300 text-light400_light500"
    >
      <PurchaseForm
        purchase={purchase}
        isEdit
        exchangeRateD={exchangeRateD}
        exchangeRateT={exchangeRateT}
      />
    </CardContainer>
  );
};

export default EditPurchase;
