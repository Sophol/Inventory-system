"use client";
import { Button } from "@/components/ui/button";
import { DEFAULT_UNAUTHORIZED } from "@/constants/states";
import Image from "next/image";
import Link from "next/link";

interface StateSkeletonProps {
  image: {
    light: string;
    dark: string;
    alt: string;
  };
  title: string;
  message: string;
  button?: {
    text: string;
    href: string;
  };
}

const StateSkeleton = ({
  image,
  title,
  message,
  button,
}: StateSkeletonProps) => (
  <div className="mt-8 flex w-full flex-col justify-center items-center sm:mt-16">
    <>
      <Image
        src={image.dark}
        alt={image.alt}
        width={270}
        height={200}
        className="hidden object-contain dark:block"
      />
      <Image
        src={image.light}
        alt={image.alt}
        width={270}
        height={200}
        className="object-contain dark:hidden"
      />
    </>
    <h2 className="h2-bold text-dark200_light900 mt-8">{title}</h2>
    <p className="bordy-regular text-dark500_light700 my-3.5 max-w-md text-center">
      {message}
    </p>
    {button && (
      <Link href={button.href}>
        <Button className="paragraph-medium mt-5 min-h-[46px] rounded-lg bg-primary-500 text-light-900 hover:bg-primary-500">
          {button.text}
        </Button>
      </Link>
    )}
  </div>
);
const Unauthorized: React.FC = () => {
  return (
    <StateSkeleton
      image={{
        light: "/images/light-error.png",
        dark: "/images/dark-error.png",
        alt: "Empty State error",
      }}
      title={DEFAULT_UNAUTHORIZED.title}
      message={DEFAULT_UNAUTHORIZED.message}
      button={DEFAULT_UNAUTHORIZED.button}
    />
  );
};
export default Unauthorized;
