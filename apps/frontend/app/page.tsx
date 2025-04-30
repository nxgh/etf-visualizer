"use client";

import WatchList from "#components/watch-list";
import TransactionTable from "#components/transaction";
import GridTradingPresetList from "#components/grid-trading-preset/strategy-list";
import GridTradingPresetConfig from "#components/grid-trading-preset/strategy-config";
import GridTradingPresetTable from "#components/grid-trading-preset/strategy-preset-template";
import ConfigImportExport from "#components/config-import-export";
import Chart from "#components/charts";
import { Sidebar, SidebarContent, SidebarProvider, SidebarTrigger } from "@shadcn/ui/sidebar";
import GridTradingCombine from "#components/grid-trading-preset";

import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@shadcn/ui/resizable";

import { Button } from "@shadcn/ui/button";
import { MenuIcon } from "lucide-react";

export default function Home() {
  return (
    <div className="flex w-full h-full overflow-hidden">
      <WatchList />

      <div className="w-full h-full">
        <Chart className="w-full h-1/2 mb-2" />
        <GridTradingCombine className="w-full h-1/2 mt-2" />
      </div>
    </div>
  );
}
