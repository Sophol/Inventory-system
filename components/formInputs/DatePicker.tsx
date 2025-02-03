"use client";

import { useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";

const DatePicker = ({
  initialDate,
  onDateChange,
}: {
  initialDate: Date;
  onDateChange: (date: Date) => void;
}) => {
  const [date, setDate] = useState<Date | undefined>(initialDate);

  const handleChangeDate = (date: Date) => {
    setDate(date);
    onDateChange(date);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-[180px] justify-start text-left font-normal",
            !date && "text-muted-foreground"
          )}
        >
          {date
            ? format(date, "dd/MM/yyyy hh:mm:ss") // Display date and time
            : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={date}
          onSelect={(date) => date && handleChangeDate(date)}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
};

export default DatePicker;
