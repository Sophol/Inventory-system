import { useTranslations } from "next-intl";
import RedirectButton from "../formInputs/RedirectButton";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

interface CardContainerProps {
  children: React.ReactNode;
  title: string;
  redirectTitle: string;
  redirectHref: string;
  redirectIcon?: React.ElementType;
  redirectClass: string;
  isButton?: boolean;
}

const CardContainer = ({
  children,
  title,
  redirectTitle,
  redirectHref,
  redirectIcon,
  redirectClass,
  isButton = true,
}: CardContainerProps) => {
  const t = useTranslations("erp");
  return (
    <section className="container mx-auto py-0">
      <div className="flex-wrap space-y-4 p-4 sm:px-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm text-dark400_light800 mr-4">
              {t(title)}
            </CardTitle>
            {isButton && (
              <RedirectButton
                title={t(redirectTitle)}
                href={redirectHref}
                Icon={redirectIcon}
                className={redirectClass}
              />
            )}
          </CardHeader>
          <CardContent>
            <div className="container mx-auto py-1">{children}</div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default CardContainer;
