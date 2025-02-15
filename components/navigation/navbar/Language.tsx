"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";

function Language() {
  const currentLocale = useLocale();
  const [locale, setLocale] = useState<string>(currentLocale);
  const router = useRouter();

  const changeLocale = (newLocale: string) => {
    setLocale(newLocale);
    document.cookie = `ERPSP_Locale=${newLocale}; path=/; max-age=31536000`;
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
