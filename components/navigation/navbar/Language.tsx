"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Image from "next/image";
import { useRouter } from "next/navigation";

function Language() {
  const [locale, setLocale] = React.useState<string>("km");
  const router = useRouter();
  React.useEffect(() => {
    if (locale) {
      setLocale(locale);
      document.cookie = `ERPSP_Locale=${locale};`;
      router.refresh();
    } else {
      const cookieLocale = document.cookie
        .split("; ")
        .find((row) => row.startsWith("ERPSP_Locale="))
        ?.split("=")[1];
      if (cookieLocale) {
        setLocale(cookieLocale);
      } else {
        const browserLocale = "km";
        console.log();
        setLocale(browserLocale);
        document.cookie = `ERPSP_Locale=${browserLocale};`;
        router.refresh();
      }
    }
  }, [router, locale]);
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="text-primary-500">
          <Image src={`/${locale}.svg`} alt={locale} width={20} height={20} />
          <span className="sr-only">Toggle language</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setLocale("en")}>
          <Image src={"/en.svg"} alt="En" width={20} height={20} />
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setLocale("km")}>
          <Image src={"/km.svg"} alt="Km" width={20} height={20} />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
export default Language;
