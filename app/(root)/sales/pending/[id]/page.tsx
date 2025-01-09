import { IoCaretBackOutline } from "react-icons/io5";

import CardContainer from "@/components/cards/CardContainer";
import SaleForm from "@/components/forms/SaleForm";
import ROUTES from "@/constants/routes";
import { getSetting } from "@/lib/actions/setting.action";
import { auth } from "@/auth";
import { notFound, redirect } from "next/navigation";
import { getSale } from "@/lib/actions/sale.action";
import { checkAuthorization } from "@/lib/auth";

const EditSale = async ({ params }: RouteParams) => {
  const isAuthorized = await checkAuthorization(["admin", "branch", "seller"]);
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
  const { data: sale, success: saleSuccess } = await getSale({
    saleId: id,
  });
  if (!saleSuccess) return notFound();
  console.log(sale);
  return (
    <CardContainer
      title="Add Sale"
      redirectTitle="BACK"
      redirectHref={ROUTES.SALES}
      redirectIcon={IoCaretBackOutline}
      redirectClass="background-light800_dark300 text-light400_light500"
    >
      <SaleForm
        sale={sale}
        isEdit
        exchangeRateD={exchangeRateD}
        exchangeRateT={exchangeRateT}
      />
    </CardContainer>
  );
};

export default EditSale;
