import { getRequestConfig } from "next-intl/server";
import { cookies } from "next/headers";

export default getRequestConfig(async () => {
  const localeCookie = (await cookies()).get("ERPSP_Locale");
  const locale = localeCookie ? localeCookie.value : "km";
  return {
    locale,
    messages: (await import(`../languages/${locale}.json`)).default,
  };
});
