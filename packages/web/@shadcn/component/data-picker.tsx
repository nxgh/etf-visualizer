import * as React from "react";
// import { format } from "date-fns";
import dayjs from "dayjs";
import { CalendarIcon } from "lucide-react";

import { cn } from "@shadcn/lib/utils";
import { Button } from "@shadcn/ui/button";
import { Calendar } from "@shadcn/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@shadcn/ui/popover";
import { SelectSingleEventHandler } from "react-day-picker";
import { Input } from "@shadcn/ui/input";

interface IProps {
  className?: string;
  date: dayjs.ConfigType;
  onSelect: (date: Date | undefined) => void;
  children?: React.ReactNode;
}

export default function SimpleDataPicker(props: IProps) {
  const { date = dayjs().toDate(), onSelect, children } = props;

  const [tmpDate, setTmpDate] = React.useState<string>(dayjs(date).format("YYYY-MM-DD"));

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn("justify-start text-left font-normal", !date && "text-muted-foreground", props.className)}
        >
          <CalendarIcon />
          {/* {!children && date ? format(date, "yyyy-MM-dd") : children} */}
          <Input
            type="text"
            className="w-full bg-transparent border-none outline-none text-sm font-normal text-gray-900"
            value={dayjs(date).format("YYYY-MM-DD")}
            onChange={(e) => {
              setTmpDate(e.target.value);
            }}
          />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar mode="single" selected={dayjs(date).toDate()} onSelect={(date) => onSelect(date)} initialFocus />
      </PopoverContent>
    </Popover>
  );
}
