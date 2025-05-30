import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Control, FieldValues, Path, PathValue } from "react-hook-form";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";

interface SelectData {
  _id: string;
  title: string;
}

interface FormSelectProps<T extends FieldValues> {
  defaultValue?: string;
  items: SelectData[];
  name: Path<T>;
  label: string;
  placeholder?: string;
  message?: string;
  control: Control<T>;
  isRequired?: boolean;
  onChange?: (value: string) => void; // Add onChange prop
}

function FormSelect<T extends FieldValues>({
  defaultValue,
  items,
  name,
  label,
  placeholder,
  message,
  control,
  isRequired = true,
  onChange, // Destructure onChange prop
}: FormSelectProps<T>) {
  return (
    <FormField
      control={control}
      name={name}
      defaultValue={defaultValue as PathValue<T, Path<T>>}
      render={({ field }) => (
        <FormItem className="flex w-full flex-col">
          <FormLabel className="text-[12px] text-dark400_light800">
            {label} {isRequired && <span className="text-primary-500">*</span>}
          </FormLabel>
          <Select
            value={field.value || ""}
            onValueChange={(value) => {
              field.onChange(value);
              if (onChange) {
                onChange(value); // Call onChange prop if provided
              }
            }}
          >
            <FormControl>
              <SelectTrigger className="text-[12px] light-border-3 text-dark300_light700 no-focus h-[28px] min-h-[28px] border">
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {items.map((item) => (
                <SelectItem key={item._id} value={item._id}>
                  {item.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormDescription className="body-regular mt-2.5 text-light-500">
            {message}
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

export default FormSelect;
