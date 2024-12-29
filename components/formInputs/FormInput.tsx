import React from "react";
import { Control, FieldValues, Path, useController } from "react-hook-form";

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

type FormInputProps<T extends FieldValues> = {
  name: Path<T>;
  label?: string;
  message?: string;
  type?: string;
  control: Control<T>;
  isRequired?: boolean;
  placeholder?: string;
  readonly?: boolean;
  onChange?: (value: any) => void;
};

function FormInput<T extends FieldValues>({
  label,
  name,
  message,
  control,
  type = "text",
  isRequired = true,
  placeholder,
  readonly = false,
  onChange,
}: FormInputProps<T>) {
  const {
    field: { onChange: fieldOnChange, ...field },
  } = useController({ name, control });

  const handleChange = (value: any) => {
    let newVal;
    if (type === "number") {
      newVal = value === "" ? "" : Number(value);
    } else {
      newVal = value;
    }
    fieldOnChange(newVal);
    if (onChange) {
      onChange(value);
    }
  };
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex w-full flex-col">
          {label && (
            <FormLabel className="paragraph-semibold text-dark400_light800">
              {label}
              {isRequired && <span className="text-primary-500">*</span>}
            </FormLabel>
          )}
          <FormControl>
            <Input
              type={type}
              className="paragraph-regular light-border-3 text-dark300_light700 no-focus min-h-[36px] border"
              placeholder={placeholder}
              readOnly={readonly}
              {...field}
              value={field.value ?? ""}
              onChange={(e) => handleChange(e.target.value)}
            />
          </FormControl>
          {message && (
            <FormDescription className="body-regular mt-2.5 text-light-500">
              {message}
            </FormDescription>
          )}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

export default FormInput;
