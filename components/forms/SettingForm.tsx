"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ReloadIcon } from "@radix-ui/react-icons";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import z from "zod";

import ROUTES from "@/constants/routes";
import { toast } from "@/hooks/use-toast";
import { EditSettingSchema } from "@/lib/validations";

import FormInput from "../formInputs/FormInput";
import { Button } from "../ui/button";
import { Form } from "../ui/form";
import { editSetting } from "@/lib/actions/setting.action";

interface Params {
  setting: Setting;
  isEdit?: boolean;
}

const SettingForm = ({ setting, isEdit = false }: Params) => {
  const router = useRouter();
  const [isPending, startTransaction] = useTransition();
  const form = useForm<z.infer<typeof EditSettingSchema>>({
    resolver: zodResolver(EditSettingSchema),
    defaultValues: {
      settingId: setting?._id,
      companyName: setting?.companyName || "",
      companyNameEnglish: setting?.companyNameEnglish || "",
      companyLogo: setting?.companyLogo || "",
      address: setting?.address || "",
      phone: setting?.phone || "",
      companyOwner: setting?.companyOwner || "",
      vat_number: setting?.vat_number || "",
      exchangeRateD: setting?.exchangeRateD || 0,
      exchangeRateT: setting?.exchangeRateT || 0,
      bankName: setting?.bankName || "",
      bankAccount: setting?.bankAccount || "",
      bankNumber: setting?.bankNumber || "",
    },
  });
  const handleEditSetting = async (data: z.infer<typeof EditSettingSchema>) => {
    startTransaction(async () => {
      if (isEdit && setting) {
        const result = await editSetting({
          ...data,
        });
        if (result.success) {
          toast({
            title: "success",
            description: "Branch updated successfully.",
          });
          if (result.data) router.push(ROUTES.SETTING(setting?._id));
        } else {
          toast({
            title: `Error ${result.status}`,
            description: result.error?.message || "Something went wrong!",
            variant: "destructive",
          });
        }
      }
    });
  };
  return (
    <Form {...form}>
      <form
        className="flex flex-col gap-8"
        onSubmit={form.handleSubmit(handleEditSetting)}
      >
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          <FormInput
            name="companyName"
            label="Company Name"
            control={form.control}
          />
          <FormInput
            name="companyNameEnglish"
            label="Company Name In English"
            control={form.control}
          />
          <FormInput
            name="companyLogo"
            label="Company Logo"
            control={form.control}
          />
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <FormInput name="bankName" label="Bank Name" control={form.control} />
          <FormInput
            name="bankAccount"
            label="Bank Account"
            control={form.control}
          />
          <FormInput
            name="bankNumber"
            label="Bank Number"
            control={form.control}
          />
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <FormInput
            name="phone"
            label="Company Phone"
            control={form.control}
          />
          <FormInput
            name="address"
            label="Company Address"
            control={form.control}
          />
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <FormInput
            name="companyOwner"
            label="Company Owner"
            control={form.control}
          />
          <FormInput
            name="vat_number"
            label="VAT/GST Number"
            control={form.control}
          />
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <FormInput
            name="exchangeRateD"
            label="exchangeRate Dollar"
            type="number"
            control={form.control}
          />
          <FormInput
            name="exchangeRateT"
            label="exchangeRate Thai"
            type="number"
            control={form.control}
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

export default SettingForm;
