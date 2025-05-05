import React from "react";
import Logo from "../Logo";
import { getCategoryCleint } from "@/lib/actions/category.action";
import ROUTES from "@/constants/routes";
import { FaEnvelope, FaMapMarkerAlt, FaMobileAlt } from "react-icons/fa";
import { notFound } from "next/navigation";
import { getSetting } from "@/lib/actions/setting.action";

const Footer = async () => {
  const year = new Date().getFullYear();
  const { success, data } = await getCategoryCleint({
    page: 1,
    pageSize: 5,
    query: "",
    filter: "",
  });
  if (!success || !data) return notFound();
  const { categories } = data || [];
  const { success: successSetting, data: setting } = await getSetting({
    settingId: process.env.SETTING_ID as string,
  });
  if (!successSetting) return notFound();
  if (!setting) return notFound();
  return (
    <footer className="mt-10 bg-[#E6E9F2]">
      <div className="flex flex-col md:flex-row items-start justify-center px-6 md:px-16 lg:px-32 gap-10 py-14 border-b border-t border-gray-500/30 text-gray-500 ">
        <div className="w-4/5">
          <Logo />
          <p className="mt-6 text-sm">
            Make life easier and more affordable with the Mommy & Me Shop sale!
            We've got everything you need for your little one: stylish and
            comfortable kid's clothes, tear-free shampoo, and the vitamins they
            need to thrive – all at amazing sale prices
          </p>
        </div>

        <div className="w-1/2 flex items-center justify-start md:justify-center">
          <div>
            <h2 className="font-medium text-gray-900 mb-5">Category</h2>
            <ul className="text-sm space-y-2">
              {categories.map((category) => (
                <li key={category._id}>
                  <a
                    className="hover:underline transition"
                    href={ROUTES.PRODUCTBYCATID(category._id)}
                  >
                    {category.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="w-1/2 flex items-center justify-start md:justify-center">
          <div>
            <h2 className="font-medium text-gray-900 mb-5">Company</h2>
            <ul className="text-sm space-y-2">
              <li>
                <a className="hover:underline transition" href={ROUTES.HOME}>
                  Home
                </a>
              </li>
              <li>
                <a className="hover:underline transition" href="/about">
                  About us
                </a>
              </li>
              <li>
                <a className="hover:underline transition" href="/contact">
                  Contact us
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="w-1/2 flex items-start justify-start md:justify-center">
          <div>
            <h2 className="font-medium text-gray-900 mb-5">
              Get in <span className="text-primary-500">Touch</span>
            </h2>
            <div className="text-sm space-y-2">
              <p className="flex items-start text-gray-600">
                <FaMapMarkerAlt className="mr-2 mt-1 flex-shrink-0" />
                {setting.address}
              </p>
              <p className="flex items-center text-gray-600">
                <FaMobileAlt className="mr-2" /> {setting.phone}
              </p>
              <p className="flex items-center text-gray-600 mb-2">
                <FaEnvelope className="mr-2" /> {setting.email}
              </p>
            </div>
          </div>
        </div>
      </div>
      <p className="py-4 text-center text-xs md:text-sm">
        Copyright {year} © Momy and Me All Right Reserved.
      </p>
    </footer>
  );
};

export default Footer;
