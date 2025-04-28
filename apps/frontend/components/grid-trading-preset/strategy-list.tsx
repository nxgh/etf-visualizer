import { Trash2 } from "lucide-react";

import { Command, CommandInput, CommandItem, CommandList } from "@shadcn/ui/command";

import { cn } from "@shadcn/lib/utils";
import { Card } from "@shadcn/ui/card";
import { Button } from "@shadcn/ui/button";
import {} from "#store";
import { useQueryState } from "nuqs";
import Store, { type IGridTradeStrategyConfig } from "#store";

interface IProps {
  className?: string;
}
export default function GridTradingPresetList({ className }: IProps) {
  const [strategyId, setStrategyId] = useQueryState("strategy");
  const presetList = Store.use.presetList();
  const removePreset = Store.use.remove_preset_list();

  const onRemove = (item: IGridTradeStrategyConfig) => {
    if (String(item.id) === String(strategyId)) setStrategyId(null);
    removePreset(String(item.id));
  };
  const onClick = (id: string) => setStrategyId(id);
  return (
    <Card className={cn("rounded-lg border shadow-md w-[300px] !w-min-[300px]  h-[400px]", className)}>
      <Command>
        <CommandInput placeholder="search strategy list" />
        <CommandList className="mt-2">
          {presetList.map((item) => (
            <CommandItem key={item.id} className="flex justify-between cursor-pointer m-0 py-0">
              {/* biome-ignore lint/a11y/useKeyWithClickEvents: <explanation> */}
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
