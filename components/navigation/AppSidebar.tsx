import { GalleryVerticalEnd, LogOut } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

import { auth, signOut } from "@/auth";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import ROUTES from "@/constants/routes";

import { Button } from "../ui/button";
import NavLinks from "./navbar/NavLinks";
import { redirect } from "next/navigation";

const AppSidebar = async () => {
  const session = await auth();
  const userId = session?.user?.id;
  const role = session?.user?.role;
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-transparent text-sidebar-primary-foreground">
                <Image
                  src="/images/logo.png"
                  alt="Logo"
                  width={40}
                  height={40}
                />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">ERP SYSTEM</span>
                <span className="truncate text-xs">Inventory</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            <NavLinks userId={userId} role={role ?? "user"} />
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <div className="flex flex-col gap-3">
              {userId ? (
                <form
                  action={async () => {
                    "use server";
                    await signOut();
                    redirect(ROUTES.SIGN_IN);
                  }}
                >
                  <Button
                    type="submit"
                    className="base-medium w-fit !bg-transparent px-4 py-3"
                  >
                    <LogOut className="size-5 text-black dark:text-white" />
                    <span className="text-dark400_light900 max-lg:hidden">
                      Logout
                    </span>
                  </Button>
                </form>
              ) : (
                <>
                  <Button
                    className="small-medium btn-secondary min-h-[41px] w-full rounded-lg px-4 shadow-none"
                    asChild
                  >
                    <Link href={ROUTES.SIGN_IN}>
                      <Image
                        src="/icons/account.svg"
                        alt="Account"
                        width={20}
                        height={20}
                        className="invert-colors lg:hidden"
                      />
                      <span className="primary-text-gradient max-lg:hidden">
                        Log In
                      </span>
                    </Link>
                  </Button>
                  <Button
                    className="small-medium light-border-2 btn-tertiary text-dark400_light900 min-h-[41px] w-full rounded-lg px-4 shadow-none"
                    asChild
                  >
                    <Link href={ROUTES.SIGN_UP}>
                      <Image
                        src="/icons/sign-up.svg"
                        alt="Account"
                        width={20}
                        height={20}
                        className="invert-colors lg:hidden"
                      />
                      <span className="max-lg:hidden">Sign Up</span>
                    </Link>
                  </Button>
                </>
              )}
            </div>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
};
export default AppSidebar;
