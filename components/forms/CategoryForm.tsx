"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { CategorySchema } from "@/lib/validations";
import z from "zod";
import { Form } from "../ui/form";
import FormInput from "./FormInput";
import FormSelect from "./FormSelect";
import { Button } from "../ui/button";
import { useTransition } from "react";
import { ReloadIcon } from "@radix-ui/react-icons";
import { createCategory, editCategory } from "@/lib/actions/category.action";
import { toast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import ROUTES from "@/constants/routes";
interface Params {
  category?: Category;
  isEdit?: boolean;
}
const CategoryForm = ({ category, isEdit = false }: Params) => {
  const router = useRouter();
  const [isPending, startTransaction] = useTransition();
  const form = useForm<z.infer<typeof CategorySchema>>({
    resolver: zodResolver(CategorySchema),
    defaultValues: {
      title: category?.title || "",
      status: category?.status || "active",
    },
  });
  const statusData: SelectData[] = [
    { _id: "active", title: "Active" },
    { _id: "inactive", title: "Inactive" },
  ];
  const handleCreateCategory = async (data: z.infer<typeof CategorySchema>) => {
    startTransaction(async () => {
      if (isEdit && category) {
        const result = await editCategory({
          categoryId: category?._id,
          ...data,
        });
        if (result.success) {
          toast({
            title: "success",
            description: "Category update successfully.",
          });
          if (result.data) router.push(ROUTES.CATEGORIES);
        } else {
          toast({
            title: `Error ${result.status}`,
            description: result.error?.message || "Something went wrong!",
            variant: "destructive",
          });
        }
        return;
      }
      const result = await createCategory(data);

      if (result.success) {
        toast({
          title: "success",
          description: "Category created successfully.",
        });
        if (result.data) router.push(ROUTES.CATEGORIES);
      } else {
        toast({
          title: `Error ${result.status}`,
          description: result.error?.message || "Something went wrong!",
          variant: "destructive",
        });
      }
    });
  };
  return (
    <Form {...form}>
      <form
        className="flex flex-col gap-8"
        onSubmit={form.handleSubmit(handleCreateCategory)}
      >
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <FormInput name="title" label="Title" control={form.control} />
          <FormSelect
            name="status"
            label="Status"
            control={form.control}
            items={statusData}
          />
        </div>
        <div className="mt-2 flex justify-end">
          <Button
            type="submit"
            disabled={isPending}
            className="primary-gradient w-fit !text-light-900 uppercase"
          >
            {isPending ? (
              <>
                <ReloadIcon className="mr-2 size-4 animate-spin" />
                <span>Submitting...</span>
              </>
            ) : (
              <>{isEdit ? "Update" : "Submit"}</>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};
export default CategoryForm;
