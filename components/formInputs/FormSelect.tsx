import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Control } from "react-hook-form";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
interface FormSelectProps {
  defaultValue?: string;
  items: SelectData[];
  name: string;
  label: string;
  placeholder?: string;
  message?: string;
  control: Control<{ [key: string]: unknown }>;
  isRequired?: boolean;
}
function FormSelect({
  items,
  name,
  label,
  placeholder,
  message,
  control,
  isRequired = true,
}: FormSelectProps) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex w-full flex-col">
          <FormLabel className="paragraph-semibold text-dark400_light800">
            {label} {isRequired && <span className="text-primary-500">*</span>}
          </FormLabel>
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <FormControl>
              <SelectTrigger className="paragraph-regular light-border-3 text-dark300_light700 no-focus min-h-[36px] border">
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
