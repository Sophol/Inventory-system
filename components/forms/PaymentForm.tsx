"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { ReloadIcon } from "@radix-ui/react-icons";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import z from "zod";

import { CreatePaymentSchema } from "@/lib/validations";
import { createPayment } from "@/lib/actions/payment.action";
import ROUTES from "@/constants/routes";
import { toast } from "@/hooks/use-toast";

import { Form } from "../ui/form";
import { Button } from "../ui/button";
import FormCombobox from "../formInputs/FormCombobox";
import FormInput from "../formInputs/FormInput";
import FormSelect from "../formInputs/FormSelect";
import FormUnitVariant from "../formInputs/FormUnitVariant";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
interface Params {
  sale?: Sale;
  isEdit?: boolean;
  payment?: Payment;
}
const PaymentForm = ({ sale,  isEdit = false, payment}: Params) => {
  const router = useRouter();
  const [isPending, startTransaction] = useTransition();
  const form = useForm<z.infer<typeof CreatePaymentSchema>>({
    resolver: zodResolver(CreatePaymentSchema),
    defaultValues: {
      customer: sale?._id,
      branch: sale?.branch._id,
      referenceNo: sale?.referenceNo,
      description: "",
      paymentDate: new Date().toISOString(),
      creditAmount: 0,
      paidAmount: 0,
      balance: 0,
      paidBy: "Cash",
      paymentStatus: "Pending",
    },
  });
 

  
  const handleCreatePayment = async (
    data: z.infer<typeof CreatePaymentSchema>
  ) => {
    console.log(data);
    startTransaction(async () => {
      // if (isEdit && payment) {
      //   const result = await editPayment({
      //     paymentId: payment?._id,
      //     ...data,
      //   });
      //   if (result.success) {
      //     toast({
      //       title: "success",
      //       description: "Payment update successfully.",
      //     });
      //     if (result.data) router.push(ROUTES.SALES);
      //   } else {
      //     toast({
      //       title: `Error ${result.status}`,
      //       description: result.error?.message || "Something went wrong!",
      //       variant: "destructive",
      //     });
      //   }
      //   return;
      // }
      const result = await createPayment(data);
      if (result.success) {
        toast({
          title: "success",
          description: "Payment created successfully.",
        });
        if (result.data) router.push(ROUTES.SALES);
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
        onSubmit={form.handleSubmit(handleCreatePayment)}
      >
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <FormInput name="balance" label="Code" control={form.control} />
          <FormInput name="paidAmount" label="Paid Amount" control={form.control} />
          <FormInput name="creditAmount" label="Credit Amount" control={form.control} />
        </div>
        
          <FormInput name="referenceNo" label="Reference No" control={form.control} />
          <FormInput name="description" label="Description" control={form.control} />
          <FormInput name="paymentDate" label="Payment Date" control={form.control} />
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
export default PaymentForm;
