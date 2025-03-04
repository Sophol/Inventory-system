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
import { useTranslations } from "next-intl";

interface Params {
  setting: Setting;
  isEdit?: boolean;
}

const SettingForm = ({ setting, isEdit = false }: Params) => {
  const t = useTranslations("erp");
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
        className="flex flex-col gap-2"
        onSubmit={form.handleSubmit(handleEditSetting)}
      >
        <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
          <FormInput
            name="companyName"
            label={t("companyName")}
            control={form.control}
          />
          <FormInput
            name="companyNameEnglish"
            label={t("companyEnglishName")}
            control={form.control}
          />
          <FormInput
            name="companyLogo"
            label={t("companyLogo")}
            control={form.control}
          />
        </div>
        <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
          <FormInput
            name="bankName"
            label={t("bankName")}
            control={form.control}
          />
          <FormInput
            name="bankAccount"
            label={t("bankAccount")}
            control={form.control}
          />
          <FormInput
            name="bankNumber"
            label={t("bankNumber")}
            control={form.control}
          />
        </div>
        <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
          <FormInput
            name="phone"
            label={t("companyPhone")}
            control={form.control}
          />
          <FormInput
            name="address"
            label={t("companyAddress")}
            control={form.control}
          />
        </div>
        <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
          <FormInput
            name="companyOwner"
            label={t("companyOwner")}
            control={form.control}
          />
          <FormInput
            name="vat_number"
            label={t("vat/gstNumber")}
            control={form.control}
          />
        </div>

        <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
          <FormInput
            name="exchangeRateD"
            label={t("exchangeRateDollar")}
            type="number"
            control={form.control}
          />
          <FormInput
            name="exchangeRateT"
            label={t("exchangeRateBaht")}
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
              <>{isEdit ? t("update") : t("save")}</>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default SettingForm;
