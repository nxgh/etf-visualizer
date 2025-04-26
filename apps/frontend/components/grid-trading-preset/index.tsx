"use client";

import { cn } from "@shadcn/lib/utils";

import GridTradingPresetList from "./strategy-list";
import GridTradingPresetSetting from "./strategy-config";
import GridTradingPresetTable from "./strategy-preset";
import { useGridTradeStrategyStore } from "#store";
import { useQueryState } from "nuqs";
import { useEffect } from "react";
import { useRouter } from "next/compat/router";

export default function GridTradingPreset({ className }: { className?: string }) {
  const [strategyId, setStrategyId] = useQueryState("strategy");
  const strategyConfig = useGridTradeStrategyStore((state) => state.presetList);
  const remove = useGridTradeStrategyStore((state) => state.remove);

  const router = useRouter();

  useEffect(() => {
    try {
      const search = window.location.search;
      const searchParams = new URLSearchParams(search);
      const strategy = searchParams.get("strategy");
      if (strategy) {
        console.log("strategy", strategy);
        setStrategyId(strategy);
      }
    } catch (error) {}
  }, []);

  return (
    <div className={cn("w-full flex  gap-2", className)}>
      <GridTradingPresetList
        list={strategyConfig}
        className="w-[300px] !w-min-[300px]  h-[400px]"
        onRemove={(item) => {
          if (String(item.id) === String(strategyId)) setStrategyId(null);
          remove(item);
        }}
        onClick={(id) => setStrategyId(id)}
      />
      <div>
        <div className="flex gap-2">
          <GridTradingPresetSetting />
          <GridTradingPresetTable />
        </div>
      </div>
    </div>
  );
}
