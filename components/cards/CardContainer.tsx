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
    <section className="container mx-auto py-0">

      <div className="flex-wrap space-y-4 p-4 sm:px-4 md:px-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">

            <CardTitle className="text-xl text-dark400_light800 mr-4">
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
            <div className="container mx-auto py-1">{children}</div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default CardContainer;
