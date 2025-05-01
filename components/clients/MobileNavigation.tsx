"use client";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import ROUTES from "@/constants/routes";
import { Menu } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const MobileNavigation = ({ categories }: { categories: Category[] }) => {
  const [open, setOpen] = useState(false);
  return (
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
          {categories.map((category) => (
            <Link
              key={category._id}
              href={ROUTES.PRODUCTBYCATID(category._id)}
              className="px-4 py-2 text-lg font-medium hover:bg-accent"
              onClick={() => setOpen(false)}
            >
              {category.title}
            </Link>
          ))}

          <Link
            href="/contact"
            className="px-4 py-2 text-lg font-medium hover:bg-accent"
            onClick={() => setOpen(false)}
          >
            Contact Us
          </Link>
          <Link
            href="/about"
            className="px-4 py-2 text-lg font-medium hover:bg-accent"
            onClick={() => setOpen(false)}
          >
            About Us
          </Link>
        </div>
      </SheetContent>
    </Sheet>
  );
};
export default MobileNavigation;
