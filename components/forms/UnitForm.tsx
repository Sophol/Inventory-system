"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import z from "zod";
import { Form } from "../ui/form";
import FormInput from "../formInputs/FormInput";
import FormSelect from "../formInputs/FormSelect";
import { Button } from "../ui/button";
import { useTransition } from "react";
import { ReloadIcon } from "@radix-ui/react-icons";
import { toast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import ROUTES from "@/constants/routes";
import { CreateUnitSchema } from "@/lib/validations";
import { createUnit, editUnit } from "@/lib/actions/unit.action";
import { dataStatuses } from "@/constants/data";
interface Params {
  unit?: Unit;
  isEdit?: boolean;
}
const UnitForm = ({ unit, isEdit = false }: Params) => {
  const router = useRouter();
  const [isPending, startTransaction] = useTransition();
  const form = useForm<z.infer<typeof CreateUnitSchema>>({
    resolver: zodResolver(CreateUnitSchema),
    defaultValues: {
      title: unit?.title || "",
      status: unit?.status || "active",
    },
  });
  const statusData: SelectData[] = dataStatuses;
  const handleCreateUnit = async (data: z.infer<typeof CreateUnitSchema>) => {
    startTransaction(async () => {
      if (isEdit && unit) {
        const result = await editUnit({
          unitId: unit?._id,
          ...data,
        });
        if (result.success) {
          toast({
            title: "success",
            description: "Unit update successfully.",
          });
          if (result.data) router.push(ROUTES.UNITS);
        } else {
          toast({
            title: `Error ${result.status}`,
            description: result.error?.message || "Something went wrong!",
            variant: "destructive",
          });
        }
        return;
      }
      const result = await createUnit(data);

      if (result.success) {
        toast({
          title: "success",
          description: "Unit created successfully.",
        });
        if (result.data) router.push(ROUTES.UNITS);
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
        onSubmit={form.handleSubmit(handleCreateUnit)}
      >
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <FormInput name="title" label="Title" control={form.control} />
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
export default UnitForm;
