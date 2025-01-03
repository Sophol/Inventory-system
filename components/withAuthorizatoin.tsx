"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { ComponentType, useEffect } from "react";

interface WithAuthorizationProps {
  requiredRoles: string[];
}

const withAuthorization = <P extends object>(
  WrappedComponent: ComponentType<P>,
  requiredRoles: string[]
) => {
  const WithAuthorization: React.FC<P & WithAuthorizationProps> = (props) => {
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
      if (status === "loading") return; // Do nothing while loading
      if (!session || !requiredRoles.includes(session.user.role)) {
        router.push("/unauthorized"); // Redirect to unauthorized page
      }
    }, [session, status, router]);

    if (
      status === "loading" ||
      !session ||
      !requiredRoles.includes(session.user.role)
    ) {
      return null; // Render nothing while checking authorization
    }

    return <WrappedComponent {...props} />;
  };

  return WithAuthorization;
};

export default withAuthorization;
