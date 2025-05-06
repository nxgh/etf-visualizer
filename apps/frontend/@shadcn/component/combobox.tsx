"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@shadcn/lib/utils";
import { Button } from "@shadcn/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@shadcn/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@shadcn/ui/popover";
import { useQueryState } from "nuqs";

export default function Combobox({ list }: { list?: { value: string | number; label: string }[] }) {
  const [open, setOpen] = React.useState(false);

  const [value, setValue] = useQueryState("sid");

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" role="combobox" aria-expanded={open} className="w-[400px] justify-between">
          {value ? list?.find((item) => item.value === value)?.label : "Select framework..."}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[400px] p-0">
        <Command>
          <CommandInput placeholder="Search framework..." className="h-9" />
          <CommandList>
            <CommandEmpty>No framework found.</CommandEmpty>
            <CommandGroup>
              {list?.map((framework) => (
                <CommandItem
                  key={framework.value}
                  value={framework.value.toString()}
                  onSelect={(currentValue) => {
                    setValue(currentValue === value ? null : currentValue);
                    setOpen(false);
                  }}
                >
                  {framework.label}
                  <Check className={cn("ml-auto", value === framework.value ? "opacity-100" : "opacity-0")} />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
