"use server";
import { getRequestConfig } from "next-intl/server";
import { cookies } from "next/headers";

export default getRequestConfig(async () => {
  const localeCookie = (await cookies()).get("ERPSP_Locale")?.value || "km";

  const locale = localeCookie;
  console.log("kkkk", locale);
  return {
    locale,
    messages: (await import(`../languages/${locale}.json`)).default,
  };
});
