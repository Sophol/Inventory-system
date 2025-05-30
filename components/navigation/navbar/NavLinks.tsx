"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@radix-ui/react-collapsible";
import { ChevronRight } from "lucide-react";
import { usePathname } from "next/navigation";
import { useMemo, useCallback, useState } from "react";

import {
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { getSidebarLinks } from "@/constants/index";
import { useTranslations } from "next-intl";

const NavLinks = ({ userId, role }: { userId?: string; role: string }) => {
  const pathname = usePathname();
  const sidebarLinks = getSidebarLinks(role);
  const [openItem, setOpenItem] = useState<string | null>(null);
  const t = useTranslations("erp");
  const isActiveRoute = useCallback(
    (route: string) => pathname === route,
    [pathname]
  );

  const initialOpenItem = useMemo(() => {
    for (const item of sidebarLinks) {
      if (
        item.items &&
        item.items.some((subItem) => isActiveRoute(subItem.url))
      ) {
        return item.title;
      }
    }
    return null;
  }, [sidebarLinks, isActiveRoute]);

  useState(() => {
    setOpenItem(initialOpenItem);
  });

  const handleCollapsibleChange = (title: string, isOpen: boolean) => {
    setOpenItem(isOpen ? title : null);
  };

  return (
    <>
      {sidebarLinks.map((item) => {
        const isActive = isActiveRoute(item.url);
        if (item.url === "/profile") {
          if (userId) item.url = `${item.url}/${userId}`;
          else return null;
        }

        return (
          <Collapsible
            key={item.title}
            open={openItem === item.title}
            onOpenChange={(isOpen) =>
              handleCollapsibleChange(item.title, isOpen)
            }
            className="group/collapsible uppercase"
          >
            <SidebarMenuItem>
              {item.items ? (
                <>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton
                      tooltip={item.title}
                      className="flex items-center justify-start gap-1 bg-transparent p-2 uppercase text-[10px]"
                    >
                      {item.icon && <item.icon />}
                      <span>{t(item.title)}</span>
                      <ChevronRight
                        className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90 "
                        size={9}
                      />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub className="text-xs">
                      {item.items.map((subItem) => {
                        const isSubActive = isActiveRoute(subItem.url);

                        return (
                          <SidebarMenuSubItem key={subItem.title}>
                            <SidebarMenuSubButton asChild>
                              <Link
                                href={subItem.url}
                                className={cn(
                                  isSubActive
                                    ? "primary-gradient rounded-lg  !text-light-900"
                                    : "text-dark300_light900",
                                  "flex items-center justify-start !text-xs gap-1 bg-transparent p-2 "
                                )}
                              >
                                {subItem.icon && <subItem.icon />}
                                <span className=" text-[10px]">
                                  {t(subItem.title)}
                                </span>
                              </Link>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        );
                      })}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </>
              ) : (
                <SidebarMenuButton asChild className="text-[10px]">
                  <Link
                    href={item.url}
                    className={cn(
                      isActive
                        ? "primary-gradient rounded-lg text-light-900 "
                        : "text-dark300_light900",
                      "flex items-center justify-start gap-1 bg-transparent p-2"
                    )}
                  >
                    {item.icon && <item.icon />}
                    <span>{t(item.title)}</span>
                  </Link>
                </SidebarMenuButton>
              )}
            </SidebarMenuItem>
          </Collapsible>
        );
      })}
    </>
  );
};

export default NavLinks;
