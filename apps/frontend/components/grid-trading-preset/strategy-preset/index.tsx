import { useEffect, useState } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@shadcn/ui/card";
import { Input } from "@shadcn/ui/input";
import createEnums from "#utils/createEnums";
import SimpleTable from "@shadcn/component/table";

import { generateTransactionPreset, type TransactionPresetType } from "./gen-tran-preset";
import { useQueryState, parseAsString } from "nuqs";
import { useSearchParams } from "next/navigation";
import { useWatchListStore, useGridTradeStrategyStore } from "#store/index";
import GridLevelRecord from "./preset-data.helper";
import GridLevelRecordType from "./preset-data";

export default function TransactionPresetTable() {
  const searchParams = useSearchParams();
  const [strategyId, setStrategyId] = useQueryState("strategy", parseAsString.withDefault(searchParams.get("strategy") ?? ""));

  const [presetDetail, setPresetDetail] = useState<GridLevelRecordType[]>([]);

  const strategyStore = useGridTradeStrategyStore((state) => state.presetList);

  useEffect(() => {
    const strategy = strategyStore.find((item) => item.id === Number(strategyId));
    if (strategyId && strategy) {
      // setForm(strategy);

      const transactions = GridLevelRecord.generate(strategy);
      setPresetDetail(transactions);
      console.log(transactions);
    }
  }, [strategyId, strategyStore]);

  const columns = [
    { label: "序号", key: "positionIndex", render: (item: GridLevelRecordType) => <Input value={item.positionIndex} /> },
    { label: "档位", key: "level", render: (item: GridLevelRecordType) => <Input value={item.level} /> },
    { label: "买入价格", key: "buyPrice", render: (item: GridLevelRecordType) => <Input value={item.buyPrice} /> },
    { label: "买入数量", key: "buyQuantity", render: (item: GridLevelRecordType) => <Input value={item.buyQuantity} /> },
    { label: "买入金额", key: "buyAmount", render: (item: GridLevelRecordType) => <Input value={item.buyAmount} /> },
    { label: "卖出价格", key: "sellPrice", render: (item: GridLevelRecordType) => <Input value={item.sellPrice} /> },
    { label: "卖出数量", key: "sellQuantity", render: (item: GridLevelRecordType) => <Input value={item.sellQuantity} /> },
    { label: "卖出金额", key: "sellAmount", render: (item: GridLevelRecordType) => <Input value={item.sellAmount} /> },
    { label: "留存数量", key: "remainingQuantity", render: (item: GridLevelRecordType) => <Input value={item.remainingQuantity} /> },
    { label: "留存利润", key: "retainedProfit", render: (item: GridLevelRecordType) => <Input value={item.retainedProfit} /> },
    { label: "收益", key: "profit", render: (item: GridLevelRecordType) => <Input value={item.profit} /> },
    { label: "收益率", key: "yieldRate", render: (item: GridLevelRecordType) => <Input value={item.yieldRate} /> },
  ];

  return (
    <Card className="w-[1200px]  overflow-auto">
      <CardHeader>
        <CardTitle>Grid Trading Preset</CardTitle>
      </CardHeader>
      <CardContent>
        <SimpleTable columns={columns} data={presetDetail} />
      </CardContent>
    </Card>
  );
}
