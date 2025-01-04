"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { ReloadIcon } from "@radix-ui/react-icons";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import z from "zod";

import ROUTES from "@/constants/routes";
import { toast } from "@/hooks/use-toast";
import { getBranches } from "@/lib/actions/branch.action";
import { CreateGeneralExpSchema } from "@/lib/validations";

import FormCombobox from "../formInputs/FormCombobox";
import FormDatePicker from "../formInputs/FormDatePicker";
import FormInput from "../formInputs/FormInput";
import { Button } from "../ui/button";
import { Form } from "../ui/form";
import { Types } from "mongoose";
import {
  createGeneralExp,
  editGeneralExp,
} from "@/lib/actions/generalExp.action";

interface Params {
  generalExp?: GeneralExp;
  isEdit?: boolean;
  exchangeRateD?: number;
  exchangeRateT?: number;
}

const GeneralExpForm = ({
  generalExp,
  isEdit = false,
  exchangeRateD,
  exchangeRateT,
}: Params) => {
  const router = useRouter();
  const [isPending, startTransaction] = useTransition();
  const form = useForm<z.infer<typeof CreateGeneralExpSchema>>({
    resolver: zodResolver(CreateGeneralExpSchema),
    defaultValues: {
      title: generalExp?.title || "",
      branch: generalExp?.branch._id || new Types.ObjectId(),
      description: generalExp?.description || "",
      generalDate: generalExp?.generalDate
        ? new Date(generalExp.generalDate)
        : new Date(),
      amount: generalExp?.amount || 0,
      exchangeRateD: generalExp?.exchangeRateD || exchangeRateD || 0,
      exchangeRateT: generalExp?.exchangeRateT || exchangeRateT || 0,
    },
  });

  const handleCreateGeneralExp = async (
    data: z.infer<typeof CreateGeneralExpSchema>
  ) => {
    startTransaction(async () => {
      if (isEdit && generalExp) {
        const result = await editGeneralExp({
          generalExpId: generalExp?._id,
          ...data,
        });
        if (result.success) {
          toast({
            title: "Success",
            description: "General expense updated successfully.",
          });
          if (result.data) router.push(ROUTES.GENERALEXPS);
        } else {
          toast({
            title: `Error ${result.status}`,
            description: result.error?.message || "Something went wrong!",
            variant: "destructive",
          });
        }
        return;
      }
      const result = await createGeneralExp(data);

      if (result.success) {
        toast({
          title: "Success",
          description: "General expense created successfully.",
        });
        if (result.data) router.push(ROUTES.GENERALEXPS);
      } else {
        toast({
          title: `Error ${result.status}`,
          description: result.error?.message || "Something went wrong!",
          variant: "destructive",
        });
      }
    });
  };

  const fetchBranches = async ({
    page,
    query,
  }: {
    page: number;
    query: string;
  }) => {
    const { success, data } = await getBranches({
      page: Number(page) || 1,
      pageSize: 10,
      query: query || "",
    });
    if (success) {
      return { data: data?.branches || [], isNext: data?.isNext || false };
    }
    return { data: [], isNext: false };
  };

  return (
    <Form {...form}>
      <form
        className="flex flex-col gap-8"
        onSubmit={form.handleSubmit(handleCreateGeneralExp)}
      >
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <FormInput
            name="title"
            label="Title"
            type="text"
            control={form.control}
          />
          <FormCombobox
            control={form.control}
            name="branch"
            label="Branch"
            placeholder="Select Branch"
            fetchSingleItem={generalExp ? generalExp.branch : null}
            fetchData={fetchBranches}
            setValue={form.setValue}
          />
          <FormInput
            name="amount"
            label="Amount"
            type="number"
            control={form.control}
          />
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <FormDatePicker
            name="generalDate"
            label="Date"
            control={form.control}
            defaultValue={new Date()}
          />
          <FormInput
            name="exchangeRateD"
            label="ExchangeRate Dollar"
            type="number"
            control={form.control}
          />
          <FormInput
            name="exchangeRateT"
            label="ExchangeRate Thai"
            type="number"
            control={form.control}
          />
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-1">
          <FormInput
            name="description"
            label="Description"
            control={form.control}
            isRequired={false}
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
export default GeneralExpForm;
