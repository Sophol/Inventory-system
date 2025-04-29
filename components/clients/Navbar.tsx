import * as React from "react";
import Link from "next/link";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";

import Logo from "@/components/Logo";
import { getCategories } from "@/lib/actions/category.action";
import { notFound } from "next/navigation";
import ROUTES from "@/constants/routes";

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
                <Link href="/" legacyBehavior passHref>
                  <NavigationMenuLink className="group inline-flex h-9 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-primary-100 hover:text-primary-500 focus:bg-primary-100 focus:text-primary-500 focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-primary-100 data-[state=open]:bg-primary-100">
                    Home
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              {categories.map((category) => (
                <NavigationMenuItem key={category._id}>
                  <Link
                    href={ROUTES.PRODUCTBYCATID(category._id)}
                    legacyBehavior
                    passHref
                  >
                    <NavigationMenuLink className="group inline-flex h-9 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-primary-100 hover:text-primary-500 focus:bg-primary-100 focus:text-primary-500 focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-primary-100 data-[state=open]:bg-primary-100">
                      {category.title}
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
              ))}
              <NavigationMenuItem>
                <Link href="/contact " legacyBehavior passHref>
                  <NavigationMenuLink className="group inline-flex h-9 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-primary-100 hover:text-primary-500 focus:bg-primary-100 focus:text-primary-500 focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-primary-100 data-[state=open]:bg-primary-100">
                    Contact Us
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link href="/about" legacyBehavior passHref>
                  <NavigationMenuLink className="group inline-flex h-9 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-primary-100 hover:text-primary-500 focus:bg-primary-100 focus:text-primary-500 focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-primary-100 data-[state=open]:bg-primary-100">
                    About Us
                  </NavigationMenuLink>
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

        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-full p-0">
            <SheetHeader className="border-b p-4">
              <SheetTitle className="text-left">Navigation</SheetTitle>
            </SheetHeader>
            <div className="flex flex-col py-4">
              <Link
                href="/"
                className="px-4 py-2 text-lg font-medium hover:bg-accent"
                onClick={() => setOpen(false)}
              >
                Home
              </Link>
              <button
                className="flex items-center justify-between px-4 py-2 text-lg font-medium hover:bg-accent text-left"
                onClick={() => setShowFeatures(!showFeatures)}
              >
                Features
                <ChevronDown
                  className={cn(
                    "h-5 w-5 transition-transform",
                    showFeatures && "rotate-180"
                  )}
                />
              </button>
              {showFeatures && (
                <div className="px-4 py-2 space-y-4">
                  {features.map((feature, index) => (
                    <Link
                      key={index}
                      href={`/feature/${feature.title
                        .toLowerCase()
                        .replace(/\s+/g, "-")}`}
                      className="flex items-start gap-4 py-2"
                      onClick={() => setOpen(false)}
                    >
                      <div className="p-2 bg-muted rounded-md">
                        <feature.icon className="h-6 w-6 text-blue-500" />
                      </div>
                      <div>
                        <h5 className="font-medium mb-1">{feature.title}</h5>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {feature.description}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
              <Link
                href="/learn"
                className="px-4 py-2 text-lg font-medium hover:bg-accent"
                onClick={() => setOpen(false)}
              >
                Learn
              </Link>
              <Link
                href="/academy"
                className="px-4 py-2 text-lg font-medium hover:bg-accent"
                onClick={() => setOpen(false)}
              >
                Academy
              </Link>
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-4 border-t bg-background">
              <div className="grid gap-2">
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => setOpen(false)}
                >
                  Log in
                </Button>
                <Button className="w-full" onClick={() => setOpen(false)}>
                  Sign up
                </Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>*/}
      </div>
    </header>
  );
};
export default NavBar;
