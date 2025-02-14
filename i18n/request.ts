"use server";
import { getRequestConfig } from "next-intl/server";
import { cookies } from "next/headers";

export default getRequestConfig(async () => {
  const allCookies = await cookies();
  const localeCookie = allCookies
    .getAll()
    .find((cookie) => cookie.name === "ERPSP_Locale");
  const locale = localeCookie ? localeCookie.value : "km";
  return {
    locale,
    messages: (await import(`../languages/${locale}.json`)).default,
  };
});
