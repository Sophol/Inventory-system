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
    const cookieLocale = document.cookie
      .split("; ")
      .find((row) => row.startsWith("ERPSP_Locale="))
      ?.split("=")[1];
    console.log("cookieLocale", document.cookie);
    if (cookieLocale) {
      setLocale(cookieLocale);
    }
  }, []);

  const changeLocale = (newLocale: string) => {
    setLocale(newLocale);
    document.cookie = `ERPSP_Locale=${newLocale};`;
    router.refresh();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="text-primary-500">
          <Image src={`/${locale}.svg`} alt={locale} width={20} height={20} />
          <span className="sr-only">Toggle language</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => changeLocale("en")}>
          <Image src={"/en.svg"} alt="En" width={20} height={20} />
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => changeLocale("km")}>
          <Image src={"/km.svg"} alt="Km" width={20} height={20} />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default Language;
