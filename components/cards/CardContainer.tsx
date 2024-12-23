import RedirectButton from "../formInputs/RedirectButton";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

interface CardContainerProps {
  children: React.ReactNode;
  title: string;
  redirectTitle: string;
  redirectHref: string;
  redirectIcon?: React.ElementType;
  redirectClass: string;
}
const CardContainer = ({
  children,
  title,
  redirectTitle,
  redirectHref,
  redirectIcon,
  redirectClass,
}: CardContainerProps) => {
  return (
    <section>
      <div className="flex-1 space-y-4 p-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="paragraph-semibold text-dark400_light800">
              {title}
            </CardTitle>
            <RedirectButton
              title={redirectTitle}
              href={redirectHref}
              Icon={redirectIcon}
              className={redirectClass}
            />
          </CardHeader>
          <CardContent>
            <div className="container mx-auto py-4">{children}</div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};
export default CardContainer;
