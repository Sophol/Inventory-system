import Link from "next/link";
import { Button } from "../ui/button";

const RedirectButton = ({
  title,
  href,
  Icon,
  className,
}: {
  title: string;
  href: string;
  Icon?: React.ElementType;
  className?: string;
}) => {
  return (
    <Link href={href}>
      <Button
        className={`flex items-center justify-start gap-1 bg-transparent body-semibold ${className}`}
      >
        {Icon && <Icon />}
        <span>{title}</span>
      </Button>
    </Link>
  );
};
export default RedirectButton;
