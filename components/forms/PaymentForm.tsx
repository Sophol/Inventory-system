"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { ReloadIcon } from "@radix-ui/react-icons";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import z from "zod";

import { CreatePaymentSchema } from "@/lib/validations";
import { createPayment } from "@/lib/actions/payment.action";
import { toast } from "@/hooks/use-toast";

import { Form } from "../ui/form";
import { Button } from "../ui/button";
import FormInput from "../formInputs/FormInput";
import FormDatePicker from "../formInputs/FormDatePicker";
import FormSelect from "../formInputs/FormSelect";

interface Params {
  sale: Sale;
  payment : Payment;
  onClose: () => void;
}

const PaymentForm = ({ sale, payment, onClose }: Params) => {
  
  const [isPending, startTransition] = useTransition();
  const form = useForm<z.infer<typeof CreatePaymentSchema>>({
    resolver: zodResolver(CreatePaymentSchema),
    defaultValues: {
      sale: sale?._id,
      customer: sale?.customer._id,
      branch: sale?.branch._id,
      referenceNo: sale?.referenceNo,
      description: payment?.description || "",
      paymentDate: payment?.paymentDate || new Date().toISOString(),
      creditAmount: payment && payment.creditAmount !== undefined 
      ? payment.creditAmount 
      : sale && sale.balance !== undefined && sale.paid !== undefined 
      ? sale.balance - sale.paid 
      : 0,
      paidAmount: 0,
      balance:sale?.balance ,
      paidBy: sale?.paidBy || "Cash",
      paymentStatus: "pending",
    },
  });
// Reset form values when the drawer is closed
useEffect(() => {
  if (!isPending) {
    form.reset({
      sale: sale?._id,
      customer: sale?.customer._id,
      branch: sale?.branch._id,
      referenceNo: sale?.referenceNo,
      description: payment?.description || "",
      paymentDate: payment?.paymentDate || new Date().toISOString(),
      creditAmount: payment && payment.creditAmount !== undefined 
          ? payment.creditAmount 
          : sale && sale.balance !== undefined && sale.paid !== undefined 
          ? sale.balance - sale.paid 
          : 0,
      paidAmount: 0,
      balance: sale?.balance ||0,
      paidBy: sale?.paidBy || "Cash",
      paymentStatus: "pending",
    });
  }
}, [isPending, sale, payment, form.reset]);
  const handleCreatePayment = async (
    data: z.infer<typeof CreatePaymentSchema>
  ) => {
    startTransition(async () => {
      try {
        data.creditAmount = sale.balance - sale.paid - (payment.paidAmount ?? 0);
        if(data.creditAmount = 0) data.paymentStatus = "completed";
        console.log(data)
        const result = await createPayment(data);
        if (result.success) {
          toast({
            title: "success",
            description: "Payment created successfully.",
          });
          onClose();
          // if (result.data) router.push(ROUTES.SALES);
        } else {
          toast({
            title: "error",
            description: result.error?.message || "Something went wrong!",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.log("error", error);
        toast({
          title: "error",
          description: (error as Error).message || "Something went wrong!",
          variant: "destructive",
        });
      }
    });
  };

  return (
    <Form {...form}>
      <form
        className="flex flex-col gap-8 p-8"
        onSubmit={form.handleSubmit(handleCreatePayment)}
      >
        <FormInput
          name="creditAmount"
          type="number"
          label="Credit Amount"
          control={form.control}
        />
        <FormInput
          name="paidAmount"
          type="number"
          label="Payment Amount"
          control={form.control}
        />
        <FormInput
          name="balance"
          type="number"
          label="Invoice Balance"
          control={form.control}
        />
        <FormInput
          name="description"
          label="Description"
          control={form.control}
        />
        <FormDatePicker
          name="paymentDate"
          label="Payment Date"
          control={form.control}
          defaultValue={new Date()}
        />
        <FormSelect
          name="paidBy"
          label="Select Payment Method"
          control={form.control}
          items={[
            { _id: "Cash", title: "Cash" },
            { _id: "ABA Bank", title: "ABA Bank" },
            { _id: "ACLEDA Bank", title: "ACLEDA Bank" },
            { _id: "Others", title: "Others" },
          ]}
        />
        <div className="mt-2 flex ">
          <Button
            type="submit"
            disabled={isPending}
            className="button-download-invoice w-fit !text-light-900 px-7"
          >
            {isPending ? (
              <>
                <ReloadIcon className="mr-2 size-4 animate-spin" />
                <span>Submitting...</span>
              </>
            ) : (
              <>Send</>
            )}
          </Button>
          <Button
            type="reset"
            className="ml-3 w-fit bg-light-400 hover:bg-light-500 !text-light-900 px-7"
          >
            {isPending ? (
              <>
                <span>Submitting...</span>
              </>
            ) : (
              <>Cancel</>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default PaymentForm;
