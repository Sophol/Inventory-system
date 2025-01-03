import { notFound, redirect } from "next/navigation";
import { IoCaretBackOutline } from "react-icons/io5";

import CardContainer from "@/components/cards/CardContainer";
import CategoryForm from "@/components/forms/CategoryForm";
import ROUTES from "@/constants/routes";
import { getCategory } from "@/lib/actions/category.action";
import { checkAuthorization } from "@/lib/auth";

const EditCatgory = async ({ params }: RouteParams) => {
  const isAuthorized = await checkAuthorization(["admin", "branch", "stock"]);
  if (!isAuthorized) {
    return redirect("/unauthorized");
  }
  const { id } = await params;
  if (!id) return notFound();
  const { data: category, success } = await getCategory({ categoryId: id });
  if (!success) return notFound();

  return (
    <CardContainer
      title="Add Category"
      redirectTitle="BACK"
      redirectHref={ROUTES.CATEGORIES}
      redirectIcon={IoCaretBackOutline}
      redirectClass="background-light800_dark300 text-light400_light500"
    >
      <CategoryForm category={category} isEdit />
    </CardContainer>
  );
};
export default EditCatgory;
