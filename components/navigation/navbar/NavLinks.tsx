"use client";
import {
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { sidebarLinks } from "@/constants/index";
import { cn } from "@/lib/utils";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@radix-ui/react-collapsible";
import { ChevronRight } from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import React, { useEffect, useState } from "react";

const NavLinks = ({ userId }: { userId?: string }) => {
  const pathname = usePathname();

  const isActiveRoute = (route: string) =>
    (pathname.includes(route) && route.length > 1) || pathname === route;

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
            asChild
            defaultOpen={item.isActive}
            className="group/collapsible uppercase"
          >
            <SidebarMenuItem>
              {item.items ? (
                <>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton
                      tooltip={item.title}
                      className="flex items-center justify-start gap-4 bg-transparent p-4 uppercase"
                    >
                      {item.icon && <item.icon />}
                      <span>{item.title}</span>
                      <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
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
                                  "flex items-center justify-start !text-xs gap-4 bg-transparent p-4"
                                )}
                              >
                                {subItem.icon && (
                                  <subItem.icon
                                    className={cn(
                                      isSubActive
                                        ? "!text-light-900"
                                        : "text-dark300_light900"
                                    )}
                                  />
                                )}
                                <span>{subItem.title}</span>
                              </Link>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        );
                      })}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </>
              ) : (
                <SidebarMenuButton asChild>
                  <Link
                    href={item.url}
                    className={cn(
                      isActive
                        ? "primary-gradient rounded-lg text-light-900"
                        : "text-dark300_light900",
                      "flex items-center justify-start gap-4 bg-transparent p-4"
                    )}
                  >
                    {item.icon && <item.icon />}
                    <span>{item.title}</span>
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
