"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { ReloadIcon } from "@radix-ui/react-icons";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import z from "zod";

import ROUTES from "@/constants/routes";
import { toast } from "@/hooks/use-toast";

import FormDatePicker from "../formInputs/FormDatePicker";
import FormInput from "../formInputs/FormInput";
import { Button } from "../ui/button";
import { Form } from "../ui/form";
import { useTranslations } from "use-intl";
import { editProductQR } from "@/lib/actions/serialNumber.action";
import { EditProductQRSchema } from "@/lib/validations";
import FormSelect from "../formInputs/FormSelect";
import QrCode from "../QrCode";

interface Params {
  productQR?: ProductQR;
  isEdit?: boolean;
}

const ProductQRForm = ({ productQR, isEdit = false }: Params) => {
  const t = useTranslations("erp");
  const router = useRouter();
  const [isPending, startTransaction] = useTransition();
  const form = useForm<z.infer<typeof EditProductQRSchema>>({
    resolver: zodResolver(EditProductQRSchema),
    defaultValues: {
      productQrId: productQR?._id || "",
      expired_date: productQR?.expired_date
        ? new Date(productQR.expired_date)
        : undefined,
      status:
        productQR?.status !== undefined ? productQR.status.toString() : "1",
      is_print: productQR?.is_print ? "true" : "false",
      remarks: productQR?.remarks || "",
    },
  });
  const text =
    process.env.NEXT_PUBLIC_BASE_URL + "/verify/p=" + productQR?.encrypt_serial;
  const logo = "/images/logo-bg.png"; // Adjust the logo path as needed
  const handleEditProductQR = async (
    data: z.infer<typeof EditProductQRSchema>
  ) => {
    startTransaction(async () => {
      if (isEdit && productQR) {
        const result = await editProductQR(data);
        if (result.success) {
          toast({
            title: "Success",
            description: "Product QR updated successfully.",
          });
          if (result.data) router.push(ROUTES.PRODUCTQRS);
        } else {
          toast({
            title: `Error ${result.status}`,
            description: result.error?.message || "Something went wrong!",
            variant: "destructive",
          });
        }
        return;
      }
    });
  };
  const statusData: SelectData[] = [
    { title: "Active", _id: "1" },
    { title: "Inactive", _id: "0" },
  ];
  const isPrintedData: SelectData[] = [
    { title: "True", _id: "true" },
    { title: "False", _id: "false" },
  ];
  return (
    <Form {...form}>
      <form
        className="flex flex-col gap-8"
        onSubmit={form.handleSubmit(handleEditProductQR)}
      >
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <FormDatePicker
            name="expired_date"
            label={t("expired_date")}
            control={form.control}
            isRequired={false}
          />
          <FormSelect
            name="status"
            label={t("status")}
            control={form.control}
            items={statusData}
          />
          <FormSelect
            name="is_print"
            label={t("is_print")}
            control={form.control}
            items={isPrintedData}
          />
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-1">
          <FormInput
            name="remarks"
            label={t("remarks")}
            control={form.control}
            isRequired={false}
          />
        </div>
        <div className="mt-2 flex justify-center">
          <QrCode text={text} logo={logo} />
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
export default ProductQRForm;
