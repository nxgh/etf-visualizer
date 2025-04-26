import { Trash2 } from "lucide-react";

import { Command, CommandInput, CommandItem, CommandList } from "@shadcn/ui/command";

import { cn } from "@shadcn/lib/utils";
import { Card } from "@shadcn/ui/card";
import type GridTradeStrategyConfigType from "../strategy-config/strategy-config.type";
import { Button } from "@shadcn/ui/button";

interface IProps {
  className?: string;
  list: GridTradeStrategyConfigType[];
  onRemove?: (item: GridTradeStrategyConfigType) => void;
  onClick?: (id: string) => void;
}
export default function GridTradingPresetList({ className, list, onRemove, onClick }: IProps) {
  return (
    <Card className="p-2">
      <Command className={cn("rounded-lg border shadow-md", className)}>
        <CommandInput placeholder="search strategy list" />
        <CommandList className="mt-2">
          {list.map((item) => (
            <CommandItem key={item.id} className="flex justify-between cursor-pointer m-0 py-0">
              <div className="flex-1 cursor-pointer leading-[2] px-3 " onClick={() => onClick?.(item.id.toString())}>
                {item.gridName}
              </div>
              <Button variant="ghost" onClick={() => onRemove?.(item)} className="px-1 py-1" size="sm">
                <Trash2 className="text-red-500 cursor-pointer" />{" "}
              </Button>
            </CommandItem>
          ))}
        </CommandList>
      </Command>
    </Card>
  );
}
