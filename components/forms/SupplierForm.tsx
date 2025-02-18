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
import { createSupplier, editSupplier } from "@/lib/actions/supplier.action";
import { CreateSupplierSchema } from "@/lib/validations";

import FormInput from "../formInputs/FormInput";
import FormSelect from "../formInputs/FormSelect";
import { Button } from "../ui/button";
import { Form } from "../ui/form";
import { useTranslations } from "use-intl";

interface Params {
  supplier?: Supplier;
  isEdit?: boolean;
}

const SupplierForm = ({ supplier, isEdit = false }: Params) => {
  const t = useTranslations("erp");
  const router = useRouter();
  const [isPending, startTransaction] = useTransition();
  const form = useForm<z.infer<typeof CreateSupplierSchema>>({
    resolver: zodResolver(CreateSupplierSchema),
    defaultValues: {
      companyName: supplier?.companyName || "",
      name: supplier?.name || "",
      phone: supplier?.phone || "",
      email: supplier?.email || "",
      socialLink: supplier?.socialLink || "",
      location: supplier?.location || "",
      description: supplier?.description || "",
      status: supplier?.status || "active",
    },
  });
  const statusData: SelectData[] = dataStatuses;
  const handleCreateSupplier = async (
    data: z.infer<typeof CreateSupplierSchema>
  ) => {
    startTransaction(async () => {
      if (isEdit && supplier) {
        const result = await editSupplier({
          supplierId: supplier?._id,
          ...data,
        });
        if (result.success) {
          toast({
            title: "success",
            description: "Supplier updated successfully.",
          });
          if (result.data) router.push(ROUTES.SUPPLIERS);
        } else {
          toast({
            title: `Error ${result.status}`,
            description: result.error?.message || "Something went wrong!",
            variant: "destructive",
          });
        }
        return;
      }
      const result = await createSupplier(data);

      if (result.success) {
        toast({
          title: "success",
          description: "Supplier created successfully.",
        });
        if (result.data) router.push(ROUTES.SUPPLIERS);
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
        onSubmit={form.handleSubmit(handleCreateSupplier)}
      >
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <FormInput
            name="companyName"
            label={t("companyName")}
            control={form.control}
          />
          <FormInput name="name" label={t("name")} control={form.control} />
          <FormInput name="phone" label={t("phone")} control={form.control} />
          <FormInput
            name="email"
            label={t("email")}
            isRequired={false}
            control={form.control}
          />
          <FormInput
            name="socialLink"
            isRequired={false}
            label={t("socialLinks")}
            control={form.control}
          />
          <FormInput
            name="location"
            label={t("location")}
            control={form.control}
          />
          <FormInput
            name="description"
            isRequired={false}
            label={t("description")}
            control={form.control}
          />
          <FormSelect
            name="status"
            label={t("status")}
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
              <>{isEdit ? t("update") : t("save")}</>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default SupplierForm;
