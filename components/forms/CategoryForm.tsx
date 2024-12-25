"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ReloadIcon } from "@radix-ui/react-icons";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import z from "zod";

import { dataStatuses } from "@/constants/data";
import ROUTES from "@/constants/routes";
import { toast } from "@/hooks/use-toast";
import { createCategory, editCategory } from "@/lib/actions/category.action";
import { CreateCategorySchema } from "@/lib/validations";

import FormInput from "../formInputs/FormInput";
import FormSelect from "../formInputs/FormSelect";
import { Button } from "../ui/button";
import { Form } from "../ui/form";

interface Params {
  category?: Category;
  isEdit?: boolean;
}
const CategoryForm = ({ category, isEdit = false }: Params) => {
  const router = useRouter();
  const [isPending, startTransaction] = useTransition();
  const form = useForm<z.infer<typeof CreateCategorySchema>>({
    resolver: zodResolver(CreateCategorySchema),
    defaultValues: {
      title: category?.title || "",
      status: category?.status || "active",
    },
  });
  const statusData: SelectData[] = dataStatuses;
  const handleCreateCategory = async (
    data: z.infer<typeof CreateCategorySchema>
  ) => {
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
            className="primary-gradient w-fit  uppercase !text-light-900 "
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
