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

interface Params {
  customer?: Customer;
  isEdit?: boolean;
}

const CustomerForm = ({ customer, isEdit = false }: Params) => {
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
          <FormInput name="name" label="Name" control={form.control} />
          <FormInput name="phone" label="Phone" control={form.control} />
          <FormInput
            name="email"
            label="Email"
            isRequired={false}
            control={form.control}
          />
          <FormInput
            name="socialLink"
            label="Social Link"
            control={form.control}
          />
          <FormSelect
            name="province"
            label="Province"
            control={form.control}
            items={provinceData}
          />
          <FormInput name="location" label="Location" control={form.control} />
          <FormSelect
            name="gender"
            label="Gender"
            control={form.control}
            items={genderData}
          />

          <FormCheckBox name="isDepo" label="Is Depo" control={form.control} />
          <FormInput
            isRequired={false}
            name="product_brand"
            label="Product Brand"
            control={form.control}
          />
          <FormInput
            isRequired={false}
            name="idNumber"
            label="ID number"
            control={form.control}
          />
          <FormDatePicker
            name="idIssueDate"
            label="ID Issue Date"
            control={form.control}
            defaultValue={new Date()}
          />
          <FormInput
            isRequired={false}
            name="address"
            label="Address"
            control={form.control}
          />
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <FormInput
            name="attachmentUrl"
            label="Attachment Url"
            isRequired={false}
            control={form.control}
          />
          <FormInput
            name="guarantor1"
            label="Guarantor 1"
            isRequired={false}
            control={form.control}
          />
          <FormInput
            name="guarantor2"
            label="Guarantor 2"
            isRequired={false}
            control={form.control}
          />
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

export default CustomerForm;
