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
import { CreateSalarySchema } from "@/lib/validations";

import FormCombobox from "../formInputs/FormCombobox";
import FormDatePicker from "../formInputs/FormDatePicker";
import FormInput from "../formInputs/FormInput";
import { Button } from "../ui/button";
import { Form } from "../ui/form";
import { getStaffs } from "@/lib/actions/user.action";
import { Types } from "mongoose";
import { createSalary, editSalary } from "@/lib/actions/salary.action";
import { api } from "@/lib/api";

interface Params {
  salary?: Salary;
  isEdit?: boolean;
  exchangeRateD?: number;
  exchangeRateT?: number;
}

const SalaryForm = ({
  salary,
  isEdit = false,
  exchangeRateD,
  exchangeRateT,
}: Params) => {
  const router = useRouter();
  const [isPending, startTransaction] = useTransition();
  const form = useForm<z.infer<typeof CreateSalarySchema>>({
    resolver: zodResolver(CreateSalarySchema),
    defaultValues: {
      staffId: salary?.staffId._id || new Types.ObjectId(),
      branch: salary?.branch._id || new Types.ObjectId(),
      description: salary?.description || "",
      salaryDate: salary?.salaryDate ? new Date(salary.salaryDate) : new Date(),
      salary: salary?.salary || 0,
      allowance: salary?.allowance || 0,
      deduction: salary?.deduction || 0,
      exchangeRateD: salary?.exchangeRateD || exchangeRateD || 0,
      exchangeRateT: salary?.exchangeRateT || exchangeRateT || 0,
      netSalary: salary?.netSalary || 0,
    },
  });
  const handleCreateSalary = async (
    data: z.infer<typeof CreateSalarySchema>
  ) => {
    startTransaction(async () => {
      if (isEdit && salary) {
        const result = await editSalary({
          salaryId: salary?._id,
          ...data,
        });
        if (result.success) {
          toast({
            title: "success",
            description: "Purchase updated successfully.",
          });
          if (result.data) router.push(ROUTES.SALARYEXPS);
        } else {
          toast({
            title: `Error ${result.status}`,
            description: result.error?.message || "Something went wrong!",
            variant: "destructive",
          });
        }
        return;
      }
      const result = await createSalary(data);

      if (result.success) {
        toast({
          title: "success",
          description: "Salary created successfully.",
        });
        if (result.data) router.push(ROUTES.SALARYEXPS);
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
  const fetchStaffs = async ({
    page,
    query,
  }: {
    page: number;
    query: string;
  }) => {
    const { success, data } = await getStaffs({
      page: Number(page) || 1,
      pageSize: 10,
      query: query || "",
    });
    if (success) {
      const users =
        data?.users.map((user) => ({
          _id: user._id,
          title: user.username,
        })) || [];
      return { data: users, isNext: data?.isNext || false };
    }
    return { data: [], isNext: false };
  };
  const handleChangeStaff = async (staffId: string) => {
    const { data: user, success } = await api.users.getById(staffId);
    if (success && user) {
      form.setValue("salary", user.salary || 0);
    } else {
      form.setValue("salary", 0);
    }
    form.setValue("allowance", 0);
    form.setValue("deduction", 0);
    calculateNetSalary();
  };
  const calculateNetSalary = () => {
    const salary = form.getValues("salary");
    const allowance = form.getValues("allowance");
    const deduction = form.getValues("deduction");
    const netSalary = salary + allowance - deduction;
    form.setValue("netSalary", netSalary);
  };
  return (
    <Form {...form}>
      <form
        className="flex flex-col gap-8"
        onSubmit={form.handleSubmit(handleCreateSalary)}
      >
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <FormCombobox
            control={form.control}
            name="staffId"
            label="Staff"
            placeholder="Select Staff"
            fetchSingleItem={salary ? salary.staffId : null}
            fetchData={fetchStaffs}
            setValue={(name, value) => {
              form.setValue(name, value);
              handleChangeStaff(value);
            }} // Replace with actual supplier data
          />
          <FormCombobox
            control={form.control}
            name="branch"
            label="Branch"
            placeholder="Select Branch"
            fetchSingleItem={salary ? salary.branch : null}
            fetchData={fetchBranches}
            setValue={form.setValue} // Replace with actual branch data
          />
          <FormInput
            name="salary"
            label="Salary"
            type="number"
            readonly
            control={form.control}
          />
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <FormDatePicker
            name="salaryDate"
            label="Date"
            control={form.control}
            defaultValue={new Date()}
          />
          <FormInput
            name="allowance"
            label="Allowance"
            type="number"
            control={form.control}
            onChange={() => calculateNetSalary()}
          />
          <FormInput
            name="deduction"
            label="Deduction"
            type="number"
            onChange={() => calculateNetSalary()}
            control={form.control}
          />
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
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
          <FormInput
            name="netSalary"
            label="Net Salary"
            type="number"
            readonly
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
export default SalaryForm;
