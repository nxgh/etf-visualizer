import { Trash2 } from "lucide-react";

import { Command, CommandInput, CommandItem, CommandList } from "@shadcn/ui/command";

import { cn } from "@shadcn/lib/utils";
export default function GridTradingPresetList({ className, list }: { className?: string; list: any[] }) {
  return (
    <Command className={cn("rounded-lg border shadow-md", className)}>
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        {list.map((item) => (
          <CommandItem key={item.id} className="flex justify-between">
            <div className="flex-1 cursor-pointer" onClick={() => {}}>
              {item.name}
            </div>
            <Trash2 className="text-red-500 cursor-pointer" onClick={() => {}} />
          </CommandItem>
        ))}
      </CommandList>
    </Command>
  );
}
