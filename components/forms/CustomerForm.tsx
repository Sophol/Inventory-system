"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ReloadIcon } from "@radix-ui/react-icons";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import z from "zod";

import { dataProvince, dataStatuses } from "@/constants/data";
import ROUTES from "@/constants/routes";
import { toast } from "@/hooks/use-toast";
import { createCustomer, editCustomer } from "@/lib/actions/customer.action";
import { CreateCustomerSchema } from "@/lib/validations";

import FormInput from "../formInputs/FormInput";
import FormSelect from "../formInputs/FormSelect";
import { Button } from "../ui/button";
import { Form } from "../ui/form";
import FormCheckBox from "../formInputs/FormCheckBox";
import FormDatePicker from "../formInputs/FormDatePicker";
import { useTranslations } from "next-intl";

interface Params {
  customer?: Customer;
  isEdit?: boolean;
}

const CustomerForm = ({ customer, isEdit = false }: Params) => {
  const t = useTranslations("erp");
  const router = useRouter();
  const [isPending, startTransaction] = useTransition();
  const form = useForm<z.infer<typeof CreateCustomerSchema>>({
    resolver: zodResolver(CreateCustomerSchema),
    defaultValues: {
      name: customer?.name || "",
      phone: customer?.phone || "",
      email: customer?.email || "",
      socialLink: customer?.socialLink || "",
      location: customer?.location || "",
      description: customer?.description || "",
      balance: customer?.balance || 0,
      saleType: customer?.saleType || "retail",
      status: customer?.status || "active",
      isDepo: customer?.isDepo || false,
      attachmentUrl: customer?.attachmentUrl || "",
      province: customer?.province || "",
      idNumber: customer?.idNumber || "",
      idIssueDate: customer?.idIssueDate || new Date(),
      address: customer?.address || "",
      guarantor1: customer?.guarantor1 || "",
      guarantor2: customer?.guarantor2 || "",
      product_brand: customer?.product_brand || "",
      gender: customer?.gender || "male",
    },
  });
  const statusData: SelectData[] = dataStatuses;
  const provinceData: SelectData[] = dataProvince;
  const genderData: SelectData[] = [
    { _id: "male", title: "Male" },
    { _id: "female", title: "Female" },
  ];
  const handleCreateCustomer = async (
    data: z.infer<typeof CreateCustomerSchema>
  ) => {
    startTransaction(async () => {
      if (isEdit && customer) {
        const result = await editCustomer({
          customerId: customer?._id,
          ...data,
        });
        if (result.success) {
          toast({
            title: "success",
            description: "Customer updated successfully.",
          });
          if (result.data) router.push(ROUTES.CUSTOMERS);
        } else {
          toast({
            title: `Error ${result.status}`,
            description: result.error?.message || "Something went wrong!",
            variant: "destructive",
          });
        }
        return;
      }
      const result = await createCustomer(data);

      if (result.success) {
        toast({
          title: "success",
          description: "Customer created successfully.",
        });
        if (result.data) router.push(ROUTES.CUSTOMERS);
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
        onSubmit={form.handleSubmit(handleCreateCustomer)}
      >
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
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
            label={t("socialLinks")}
            control={form.control}
          />
          <FormSelect
            name="province"
            label={t("province")}
            control={form.control}
            items={provinceData}
          />
          <FormInput name="location" label="Location" control={form.control} />
          <FormSelect
            name="gender"
            label={t("gender")}
            control={form.control}
            items={genderData}
          />

          <FormCheckBox name="isDepo" label="Is Depo" control={form.control} />
          <FormInput
            isRequired={false}
            name="product_brand"
            label={t("productBrand")}
            control={form.control}
          />
          <FormInput
            isRequired={false}
            name="idNumber"
            label={t("idNumber")}
            control={form.control}
          />
          <FormDatePicker
            name="idIssueDate"
            label={t("idIssueDate")}
            control={form.control}
            defaultValue={new Date()}
          />
          <FormInput
            isRequired={false}
            name="address"
            label={t("address")}
            control={form.control}
          />
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <FormInput
            name="attachmentUrl"
            label={t("attachmentUrl")}
            isRequired={false}
            control={form.control}
          />
          <FormInput
            name="guarantor1"
            label={t("guarantor1")}
            isRequired={false}
            control={form.control}
          />
          <FormInput
            name="guarantor2"
            label={t("guarantor2")}
            isRequired={false}
            control={form.control}
          />
          <FormInput
            name="description"
            label={t("description")}
            isRequired={false}
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

export default CustomerForm;
