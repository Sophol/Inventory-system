import { IoCaretBackOutline } from "react-icons/io5";

import CardContainer from "@/components/cards/CardContainer";
import ROUTES from "@/constants/routes";
import { getSetting } from "@/lib/actions/setting.action";
import { auth } from "@/auth";
import { notFound, redirect } from "next/navigation";
import InvoiceForm from "@/components/forms/InvoiceForm";

const page = async () => {
  const session = await auth();
  if (!session) return redirect(ROUTES.SIGN_IN);
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
      redirectHref={ROUTES.INVOICES}
      redirectIcon={IoCaretBackOutline}
      redirectClass="background-light800_dark300 text-light400_light500"
    >
      <InvoiceForm
        exchangeRateD={exchangeRateD}
        exchangeRateT={exchangeRateT}
      />
    </CardContainer>
  );
};

export default page;
