"use client";

import * as React from "react";
import { format, startOfMonth, endOfMonth } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { DateRange } from "react-day-picker";
import { useRouter } from "next/navigation"; // Import useRouter for URL updates
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useTranslations } from "use-intl";

interface DatePickerWithRangeProps
  extends React.HTMLAttributes<HTMLDivElement> {
  onDateChange?: (date: DateRange | undefined) => void; // Optional callback
  reset?: boolean;
  initialDate?: DateRange; // Optional initial date range from parent
}

export function DatePickerWithRange({
  className,
  onDateChange,
  reset,
  initialDate,
}: DatePickerWithRangeProps) {
  const router = useRouter(); // Initialize router for URL manipulation
  const [date, setDate] = React.useState<DateRange | undefined>(
    initialDate || {
      from: startOfMonth(new Date()),
      to: endOfMonth(new Date()),
    }
  );
  const defaultDateRange = React.useMemo(
    () => ({
      from: startOfMonth(new Date()),
      to: endOfMonth(new Date()),
    }),
    []
  );

  const handleDateChange = (selectedDate: DateRange | undefined) => {
    setDate(selectedDate); // Update local state

    // Update the URL with the selected date range
    if (selectedDate?.from && selectedDate?.to) {
      const dateRange = `${format(selectedDate.from, "yyyy-MM-dd")}_${format(selectedDate.to, "yyyy-MM-dd")}`;
      router.push(`?dateRange=${dateRange}`);
    } else {
      router.push("?"); // Clear the query if no range is selected
    }

    // Call the optional onDateChange callback if provided
    if (onDateChange) {
      onDateChange(selectedDate);
    }
  };

  React.useEffect(() => {
    if (reset) {
      setDate(defaultDateRange); // Reset to default range if reset is triggered
    }
  }, [reset, defaultDateRange]);

  const t = useTranslations("erp");

  return (
    <div className={cn("grid gap-0", className)}>
      <span className="text-[11px] text-dark400_light800 mb-1">
        {t("dateRange")}
      </span>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-full md:w-[250] lg:w-[250] xl:w-[280] justify-start text-left text-[11px] min-h-[28px] h-[28px]",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "LLL dd, y")} -{" "}
                  {format(date.to, "LLL dd, y")}
                </>
              ) : (
                format(date.from, "LLL dd, y")
              )
            ) : (
              <span>Pick a date</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={handleDateChange} // Call handleDateChange on selection
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
