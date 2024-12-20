"use client";
import { signIn } from "next-auth/react";
import ROUTES from "@/constants/routes";
import { toast } from "@/hooks/use-toast";
import Image from "next/image";
import { Button } from "../ui/button";

const SocialAuthForm = () => {
  const btnClass =
    "background-dark400_light900 body-medium text-dark200_light800 min-h-12 flex-1 rounded-2 px-4 py-3.5";

  const handleSignIn = async (provider: "github" | "google") => {
    try {
      await signIn(provider, {
        callbackUrl: ROUTES.HOME,
        redirect: false,
      });
    } catch (error) {
      console.log(error);
      toast({
        title: "login fialed",
        description:
          error instanceof Error
            ? error.message
            : "An error occur during sign-in",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex flex-wrap mt-10 gap-2.5">
      <Button className={btnClass} onClick={() => handleSignIn("github")}>
        <Image
          src="/icons/github.svg"
          alt="GitHub logo"
          width={20}
          height={20}
          className="invert-colors mr-2.5 object-contain"
        />
        <span>Login with GitHub</span>
      </Button>
      <Button className={btnClass} onClick={() => handleSignIn("google")}>
        <Image
          src="/icons/google.svg"
          alt="Google logo"
          width={20}
          height={20}
          className="mr-2.5 object-contain"
        />
        <span>Login with GitHub</span>
      </Button>
    </div>
  );
};
export default SocialAuthForm;
