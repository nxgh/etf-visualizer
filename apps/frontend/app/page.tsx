"use client";

import WatchList from "#components/watch-list";
import TransactionTable from "#components/transaction";
import GridTradingPresetList from "#components/grid-trading-preset/strategy-list";
import GridTradingPresetConfig from "#components/grid-trading-preset/strategy-config";
import GridTradingPresetTable from "#components/grid-trading-preset/strategy-preset-template";
import ConfigImportExport from "#components/config-import-export";
import Chart from "#components/charts";

export default function Home() {
  return (
    <div className="w-full h-full flex flex-wrap">
      {/* <ConfigImportExport /> */}
      <WatchList className="w-[400px]" />
      <GridTradingPresetList />
      <GridTradingPresetConfig />
      <GridTradingPresetTable />

      <TransactionTable className="h-1/2" />
      <Chart />
    </div>
  );
}
