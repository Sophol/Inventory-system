import { auth } from "@/auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SidebarTrigger } from "@/components/ui/sidebar";
import UserAvatar from "@/components/UserAvatar";
import { Plus, Sun } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import MobileNavigation from "./MobileNavigation";
import Theme from "./Theme";

const NavBar = async () => {
  const session = await auth();
  return (
    <div className="flex h-16 items-center gap-4 border-b px-4">
      <SidebarTrigger />
      <div className="flex-1">
        <Input placeholder="Search products..." className="max-w-sm" />
      </div>
      <Theme />
      {session?.user?.id && (
        <UserAvatar
          id={session.user.id}
          name={session.user.name!}
          imageUrl={session.user.image!}
        />
      )}
    </div>
  );
};
export default NavBar;
