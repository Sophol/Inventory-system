import { IoCaretBackOutline } from "react-icons/io5";

import CardContainer from "@/components/cards/CardContainer";
import ROUTES from "@/constants/routes";
import { getSetting } from "@/lib/actions/setting.action";
import { notFound, redirect } from "next/navigation";
import InvoiceForm from "@/components/forms/InvoiceForm";
import { checkAuthorization } from "@/lib/auth";
import { auth } from "@/auth";

const page = async () => {
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
  const session = await auth();
  if (!session) return redirect("/login");
  let isSeller = false;
  if (session.user.role === "seller") isSeller = true;
  return (
    <CardContainer
      title="invoice"
      redirectTitle="back"
      redirectHref={ROUTES.INVOICES}
      redirectIcon={IoCaretBackOutline}
      redirectClass="background-light800_dark300 text-light400_light500"
    >
      <InvoiceForm
        exchangeRateD={exchangeRateD}
        exchangeRateT={exchangeRateT}
        isSeller={isSeller}
      />
    </CardContainer>
  );
};

export default page;
