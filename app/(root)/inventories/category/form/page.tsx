import { IoCaretBackOutline } from "react-icons/io5";

import CardContainer from "@/components/cards/CardContainer";
import CategoryForm from "@/components/forms/CategoryForm";
import ROUTES from "@/constants/routes";
import { checkAuthorization } from "@/lib/auth";
import { redirect } from "next/navigation";

const page = async () => {
  const isAuthorized = await checkAuthorization(["admin", "branch", "stock"]);
  if (!isAuthorized) {
    return redirect("/unauthorized");
  }
  return (
    <CardContainer
      title="Add Category"
      redirectTitle="BACK"
      redirectHref={ROUTES.CATEGORIES}
      redirectIcon={IoCaretBackOutline}
      redirectClass="background-light800_dark300 text-light400_light500"
    >
      <CategoryForm />
    </CardContainer>
  );
};
export default page;
