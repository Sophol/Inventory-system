import { assets } from "@/assets/assets";
import Image from "next/image";
import Link from "next/link";
import * as React from "react";

const Logo = () => {
  return (
    <Link href={"/"} className="flex items-center space-x-2">
      <div className=" rounded-full p-1">
        <span className="text-white font-bold text-xl">
          <Image className="w-10" src={assets.logo_new} alt="logo" />
        </span>
      </div>
      <span className="font-bold text-xl min-xl:hidden">Mommy&Me</span>
    </Link>
  );
};

export default Logo;
