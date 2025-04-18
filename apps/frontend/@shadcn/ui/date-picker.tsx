"use client";

import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { cn } from "@shadcn/lib/utils";
import { Button } from "@shadcn/ui/button";
import { Calendar } from "@shadcn/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@shadcn/ui/popover";

export function DatePicker({
  onSelect = (date: Date) => {},
  value = new Date(),
}: {
  onSelect: (date: Date) => void;
  value: Date;
}) {
  const [open, setOpen] = React.useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn("justify-start text-left font-normal", !value && "text-muted-foreground")}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {value ? format(value, "yyyy-MM-dd") : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar mode="single" selected={value} onSelect={(date) => {
          onSelect(date!);
          setOpen(false);
        }} initialFocus />
      </PopoverContent>
    </Popover>
  );
}
