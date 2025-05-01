import * as React from "react";
import Link from "next/link";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";

import Logo from "@/components/Logo";
import { getCategories } from "@/lib/actions/category.action";
import { notFound } from "next/navigation";
import ROUTES from "@/constants/routes";
import MobileNavigation from "./MobileNavigation";

const NavBar = async () => {
  const { success, data } = await getCategories({
    page: 1,
    pageSize: 5,
    query: "",
    filter: "",
  });
  if (!success || !data) return notFound();
  const { categories } = data || [];
  return (
    <header className="sticky px-6 md:px-16 lg:px-32 top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container  mx-auto flex h-14 items-center justify-between">
        <div className="flex items-center space-x-4">
          <Logo />
          <NavigationMenu className="hidden md:flex">
            <NavigationMenuList>
              <NavigationMenuItem>
                <Link
                  href="/"
                  className="group inline-flex h-9 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-primary-100 hover:text-primary-500 focus:bg-primary-100 focus:text-primary-500 focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-primary-100 data-[state=open]:bg-primary-100"
                >
                  Home
                </Link>
              </NavigationMenuItem>
              {categories.map((category) => (
                <NavigationMenuItem key={category._id}>
                  <Link
                    href={ROUTES.PRODUCTBYCATID(category._id)}
                    className="group inline-flex h-9 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-primary-100 hover:text-primary-500 focus:bg-primary-100 focus:text-primary-500 focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-primary-100 data-[state=open]:bg-primary-100"
                  >
                    {category.title}
                  </Link>
                </NavigationMenuItem>
              ))}
              <NavigationMenuItem>
                <Link
                  href="/contact"
                  className="group inline-flex h-9 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-primary-100 hover:text-primary-500 focus:bg-primary-100 focus:text-primary-500 focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-primary-100 data-[state=open]:bg-primary-100"
                >
                  Contact Us
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link
                  href="/about"
                  className="group inline-flex h-9 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-primary-100 hover:text-primary-500 focus:bg-primary-100 focus:text-primary-500 focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-primary-100 data-[state=open]:bg-primary-100"
                >
                  About Us
                </Link>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>
        {/* 
        <div className="hidden md:flex items-center space-x-4">
          <Button variant="ghost">Log in</Button>
          <Button>Sign up</Button>
        </div>
        */}
        <MobileNavigation categories={categories} />
      </div>
    </header>
  );
};
export default NavBar;
