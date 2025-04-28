import * as React from "react";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";

import { cn } from "@shadcn/lib/utils";
import { Button } from "@shadcn/ui/button";
import { Calendar } from "@shadcn/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@shadcn/ui/popover";
import { SelectSingleEventHandler } from "react-day-picker";

interface IProps {
  className?: string;
  date: Date;
  onSelect: SelectSingleEventHandler;
}

export default function SimpleDataPicker(props: IProps) {
  const { date, onSelect } = props;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn("justify-start text-left font-normal", !date && "text-muted-foreground", props.className)}
        >
          <CalendarIcon />
          {date ? format(date, "yyyy-MM-dd") : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar mode="single" selected={date} onSelect={onSelect} initialFocus />
      </PopoverContent>
    </Popover>
  );
}
