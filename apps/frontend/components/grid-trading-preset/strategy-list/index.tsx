import { Trash2 } from "lucide-react";

import { Command, CommandInput, CommandItem, CommandList } from "@shadcn/ui/command";

import { cn } from "@shadcn/lib/utils";
import { Card } from "@shadcn/ui/card";
import type GridTradeStrategyConfigType from "../strategy-config/strategy-config.type";
import { Button } from "@shadcn/ui/button";
import { useGridTradeStrategyStore } from "#store";
import { useQueryState } from "nuqs";

interface IProps {
  className?: string;
}
export default function GridTradingPresetList({ className }: IProps) {
  const [strategyId, setStrategyId] = useQueryState("strategy");
  const presetList = useGridTradeStrategyStore((state) => state.presetList);
  const remove = useGridTradeStrategyStore((state) => state.remove);

  const onRemove = (item: GridTradeStrategyConfigType) => {
    if (String(item.id) === String(strategyId)) setStrategyId(null);
    remove(item);
  };
  const onClick = (id: string) => setStrategyId(id);
  return (
    <Card className={cn("rounded-lg border shadow-md w-[300px] !w-min-[300px]  h-[400px]", className)}>
      <Command>
        <CommandInput placeholder="search strategy list" />
        <CommandList className="mt-2">
          {presetList.map((item) => (
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
