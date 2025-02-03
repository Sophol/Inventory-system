"use client";

import { Control, FieldValues, Path } from "react-hook-form";

import { Checkbox } from "@/components/ui/checkbox";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";

type FormCheckBoxProps<T extends FieldValues> = {
  name: Path<T>;
  label?: string;
  control: Control<T>;
};

function FormCheckBox<T extends FieldValues>({
  name,
  label,
  control,
}: FormCheckBoxProps<T>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-4">
          <FormControl>
            <Checkbox checked={field.value} onCheckedChange={field.onChange} />
          </FormControl>
          <div className="space-y-1 leading-none">
            <FormLabel>{label}</FormLabel>
          </div>
        </FormItem>
      )}
    />
  );
}
export default FormCheckBox;
