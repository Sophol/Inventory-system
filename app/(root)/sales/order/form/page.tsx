import { IoCaretBackOutline } from "react-icons/io5";

import CardContainer from "@/components/cards/CardContainer";
import SaleForm from "@/components/forms/SaleForm";
import ROUTES from "@/constants/routes";
import { getSetting } from "@/lib/actions/setting.action";
import { notFound, redirect } from "next/navigation";
import { checkAuthorization } from "@/lib/auth";
import { auth } from "@/auth";

const page = async () => {
  const session = await auth();
  if (!session) return redirect("/login");
  let isSeller = false;
  if (session.user.role === "seller") isSeller = true;

  const isAuthorized = await checkAuthorization(["admin", "branch", "seller"]);
  if (!isAuthorized) {
    return redirect("/unauthorized");
  }
  const { success, data: setting } = await getSetting({
    settingId: process.env.SETTING_ID as string,
  });
  if (!success) return notFound();
  if (!setting) return notFound();
  const { exchangeRateD, exchangeRateT } = setting;

  return (
    <CardContainer
      title="Add Sale"
      redirectTitle="BACK"
      redirectHref={ROUTES.SALES}
      redirectIcon={IoCaretBackOutline}
      redirectClass="background-light800_dark300 text-light400_light500"
    >
      <SaleForm
        exchangeRateD={exchangeRateD}
        exchangeRateT={exchangeRateT}
        isSeller={isSeller}
      />
    </CardContainer>
  );
};

export default page;
