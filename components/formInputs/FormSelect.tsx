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
interface FormSelectProps<T extends FieldValues> {
  defaultValue?: string;
  items: SelectData[];
  name: Path<T>;
  label: string;
  placeholder?: string;
  message?: string;
  control: Control<T>;
  isRequired?: boolean;
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
            onValueChange={field.onChange}
            defaultValue={field.value as string | undefined}
          >
            <FormControl>
              <SelectTrigger className="text-[12px] light-border-3 text-dark300_light700 no-focus h-[30px] min-h-[30px] border">
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
