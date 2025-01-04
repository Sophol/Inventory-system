import React from "react";
import { IoCaretBackOutline } from "react-icons/io5";

import CardContainer from "@/components/cards/CardContainer";
import SalaryForm from "@/components/forms/SalaryForm";
import ROUTES from "@/constants/routes";
import { checkAuthorization } from "@/lib/auth";
import { getSetting } from "@/lib/actions/setting.action";
import { redirect, notFound } from "next/navigation";

const page = async () => {
  const isAuthorized = await checkAuthorization(["admin", "branch"]);
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
      title="Add Salary"
      redirectTitle="BACK"
      redirectHref={ROUTES.SALARYEXPS}
      redirectIcon={IoCaretBackOutline}
      redirectClass="background-light800_dark300 text-light400_light500"
    >
      <SalaryForm exchangeRateD={exchangeRateD} exchangeRateT={exchangeRateT} />
    </CardContainer>
  );
};

export default page;
