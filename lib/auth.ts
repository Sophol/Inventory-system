import { auth } from "@/auth";

export const checkAuthorization = async (requiredRoles: string[]) => {
  const session = await auth();
  if (!session || !requiredRoles.includes(session.user.role)) {
    return false;
  }
  return true;
};
