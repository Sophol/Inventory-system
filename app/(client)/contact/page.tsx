import Contact from "@/components/clients/Contact";
import { getSetting } from "@/lib/actions/setting.action";
import { notFound } from "next/navigation";

const page = async () => {
  const { success, data: setting } = await getSetting({
    settingId: process.env.SETTING_ID as string,
  });
  if (!success) return notFound();
  if (!setting) return notFound();
  return <Contact setting={setting} />;
};
export default page;
