import Link from "next/link";
import { Button } from "../ui/button";

const RedirectButton = ({
  title,
  href,
  Icon,
  className,
  isIcon = false,
}: {
  title?: string;
  href: string;
  Icon?: React.ElementType;
  className?: string;
  isIcon?: boolean;
}) => {
  return (
    <Link href={href}>
      {isIcon ? (
        <Button
          size="icon"
          variant="ghost"
          className={`flex items-center justify-center gap-1 bg-transparent body-semibold p-0 m-0 ${className}`}
        >
          {Icon && <Icon className="p-0 m-0" />}
        </Button>
      ) : (
        <Button
          className={`flex items-center justify-start gap-1 bg-transparent body-semibold ${className}`}
        >
          {Icon && <Icon />}
          {title && <span>{title}</span>}
        </Button>
      )}
    </Link>
  );
};
export default RedirectButton;
