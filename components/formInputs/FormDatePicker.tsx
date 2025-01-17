"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Control, FieldValues, Path } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface FormDatePickerProps<T extends FieldValues> {
  name: Path<T>;
  label?: string;
  type?: string;
  control: Control<T>;
  isRequired?: boolean;
  defaultValue?: Date;
}

const FormDatePicker = <T extends FieldValues>({
  label,
  name,
  control,
  isRequired = true,
  defaultValue,
}: FormDatePickerProps<T>) => {
  const [clientDate, setClientDate] = useState<Date | null>(null);

  useEffect(() => {
    if (defaultValue) {
      const currentTime = new Date().toLocaleTimeString("en-US", {
        hour12: false,
      });
      const dateString = defaultValue.toISOString().split("T")[0];
      const dateTimeString = `${dateString}T${currentTime}`;
      setClientDate(new Date(dateTimeString));
    }
  }, [defaultValue]);

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex w-full flex-col">
          <FormLabel className="paragraph-semibold text-dark400_light800">
            {label} {isRequired && <span className="text-primary-500">*</span>}
          </FormLabel>
          <Popover>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant={"outline"}
                  className={cn(
                    "paragraph-regular light-border-3 text-dark300_light700 no-focus min-h-[36px] border",
                    !field.value && "text-muted-foreground"
                  )}
                >
                  {field.value || clientDate ? (
                    format(field.value || clientDate!, "yyyy-MM-d HH:mm:ss")
                  ) : (
                    <span>
                      {defaultValue
                        ? format(defaultValue, "yyyy-MM-d HH:mm:ss")
                        : ""}
                    </span>
                  )}
                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={field.value as Date}
                onSelect={(date) => {
                  if (date) {
                    const currentDate = new Date();
                    const currentTime = currentDate.toLocaleTimeString(
                      "en-US",
                      { hour12: false }
                    );
                    const [hours, minutes, seconds] = currentTime.split(":");
                    const selectedDate = new Date(date);
                    selectedDate.setHours(
                      parseInt(hours),
                      parseInt(minutes),
                      parseInt(seconds)
                    );
                    field.onChange(selectedDate);
                  }
                }}
                // disabled={(date) =>
                //   date > new Date("") || date < new Date("1900-01-01")
                // }
                initialFocus
              />
            </PopoverContent>
          </Popover>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default FormDatePicker;
