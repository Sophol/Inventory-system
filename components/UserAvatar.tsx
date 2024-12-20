import ROUTES from "@/constants/routes";
import Image from "next/image";
import Link from "next/link";
import { Avatar, AvatarFallback } from "./ui/avatar";

function UserAvatar({
  id,
  name,
  imageUrl,
  className = "h-9 w-9",
}: {
  id: string;
  name: string;
  imageUrl?: string;
  className?: string;
}) {
  const initials = name
    .split(" ")
    .map((word: string) => word[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
  return (
    <Link href={ROUTES.PROFILE(id)}>
      <Avatar className={className}>
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={name}
            className="w-full h-full object-cover rounded-full"
            width={36}
            height={36}
            quality={100}
          />
        ) : (
          <AvatarFallback className="primary-gradient font-space-grotesk font-bold tracking-wider text-white">
            {initials}
          </AvatarFallback>
        )}
      </Avatar>
    </Link>
  );
}
export default UserAvatar;
