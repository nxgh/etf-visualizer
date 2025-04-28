"use client";

import WatchList from "#components/watch-list";
import TransactionTable from "#components/transaction";
import GridTradingPresetList from "#components/grid-trading-preset/strategy-list";
import GridTradingPresetSetting from "#components/grid-trading-preset/strategy-config";
import GridTradingPresetTable from "#components/grid-trading-preset/strategy-preset-template";
import ConfigImportExport from "#components/config-import-export";

export default function Home() {
  return (
    <div className="w-full h-full flex flex-wrap">
      {/* <ConfigImportExport /> */}
      <WatchList className="w-[500px]" />
      {/* <GridTradingPresetList />
      <GridTradingPresetSetting />
      <GridTradingPresetTable />
      <TransactionTable className="h-1/2" /> */}
    </div>
  );
}
