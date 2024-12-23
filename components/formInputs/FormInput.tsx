import { Input } from "../ui/input";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Control } from "react-hook-form";

type FormInputProps = {
  name: string;
  label?: string;
  message?: string;
  type?: string;
  control: Control<any, any>;
  isRequired?: boolean;
};

function FormInput({
  label,
  name,
  message,
  control,
  type = "text",
  isRequired = true,
}: FormInputProps) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex w-full flex-col">
          <FormLabel className="paragraph-semibold text-dark400_light800">
            {label} {isRequired && <span className="text-primary-500">*</span>}
          </FormLabel>
          <FormControl>
            <Input
              type={type}
              className="paragraph-regular background-light700_dark300 light-border-2 text-dark300_light700 no-focus min-h-[36px] border"
              {...field}
              value={field.value ?? ""}
              onChange={(e) => {
                const value = e.target.value;
                let newVal;
                if (type === "number") {
                  newVal = value === "" ? "" : Number(value);
                } else {
                  newVal = value;
                }
                field.onChange(newVal);
              }}
            />
          </FormControl>
          <FormDescription className="body-regular mt-2.5 text-light-500">
            {message}
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

export default FormInput;
