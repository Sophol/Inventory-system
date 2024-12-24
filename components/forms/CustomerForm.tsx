"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { CreateCustomerSchema } from "@/lib/validations";
import z from "zod";
import { Form } from "../ui/form";
import FormInput from "../formInputs/FormInput";
import FormSelect from "../formInputs/FormSelect";
import { Button } from "../ui/button";
import { useTransition } from "react";
import { ReloadIcon } from "@radix-ui/react-icons";
import { createCustomer, editCustomer } from "@/lib/actions/customer.action";
import { toast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import ROUTES from "@/constants/routes";
import { dataStatuses, dataSaleTypes } from "@/constants/data";
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
      status: customer?.status || "active",
      phone: customer?.phone || "",
      email: customer?.email || "",
      social_link: customer?.social_link || "",
      description: customer?.description || "",
      saleType: customer?.saleType || "retail",
      location: customer?.location || "",
      balance: customer?.balance || ""
    },
  });
  const statusData: SelectData[] = dataStatuses;
  const saleTypeData: SelectData[] = dataSaleTypes;
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
            description: "Customer update successfully.",
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
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <FormInput name="name" label="Name" control={form.control} />
          <FormInput name="phone" label="Phone" control={form.control} />
          <FormInput name="balance" label="Balance" type="number" control={form.control} />
          <FormInput name="email" label="Email" control={form.control} />
          <FormInput name="social_link" label="Social Link" control={form.control} />
          <FormInput name="location" label="Location" control={form.control} />
          <FormInput name="description" label="Description" control={form.control} />
          <FormSelect
            name="saleType"
            label="Sale Type"
            control={form.control}
            items={saleTypeData}
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
export default CustomerForm;
