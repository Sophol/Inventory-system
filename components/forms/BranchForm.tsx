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
import { createBranch, editBranch } from "@/lib/actions/branch.action";
import { CreateBranchSchema } from "@/lib/validations";

import FormInput from "../formInputs/FormInput";
import FormSelect from "../formInputs/FormSelect";
import { Button } from "../ui/button";
import { Form } from "../ui/form";

interface Params {
  branch?: Branch;
  isEdit?: boolean;
}

const BranchForm = ({ branch, isEdit = false }: Params) => {
  const router = useRouter();
  const [isPending, startTransaction] = useTransition();
  const form = useForm<z.infer<typeof CreateBranchSchema>>({
    resolver: zodResolver(CreateBranchSchema),
    defaultValues: {
      title: branch?.title || "",
      phone: branch?.phone || "",
      location: branch?.location || "",
      description: branch?.description || "",
      status: branch?.status || "active",
    },
  });
  const statusData: SelectData[] = dataStatuses;
  const handleCreateBranch = async (
    data: z.infer<typeof CreateBranchSchema>
  ) => {
    startTransaction(async () => {
      if (isEdit && branch) {
        const result = await editBranch({
          branchId: branch?._id,
          ...data,
        });
        if (result.success) {
          toast({
            title: "success",
            description: "Branch updated successfully.",
          });
          if (result.data) router.push(ROUTES.BRANCHES);
        } else {
          toast({
            title: `Error ${result.status}`,
            description: result.error?.message || "Something went wrong!",
            variant: "destructive",
          });
        }
        return;
      }
      const result = await createBranch(data);

      if (result.success) {
        toast({
          title: "success",
          description: "Branch created successfully.",
        });
        if (result.data) router.push(ROUTES.BRANCHES);
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
        onSubmit={form.handleSubmit(handleCreateBranch)}
      >
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <FormInput name="title" label="Title" control={form.control} />
          <FormInput name="phone" label="Phone" control={form.control} />
          <FormInput name="location" label="Location" control={form.control} />
          <FormInput
            name="description"
            label="Description"
            isRequired={false}
            control={form.control}
          />
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
            className="primary-gradient w-fit uppercase !text-light-900"
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

export default BranchForm;
