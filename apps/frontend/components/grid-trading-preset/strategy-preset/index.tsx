import { useState } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@shadcn/ui/card";
import { Input } from "@shadcn/ui/input";
import createEnums from "#utils/createEnums";
import SimpleTable from "@shadcn/component/table";

import type { TransactionPresetType } from "./gen-tran-preset";

export default function TransactionPresetTable() {
  const [presetDetail, setPresetDetail] = useState<TransactionPresetType[]>([]);

  const columns = [
    { label: "序号", key: "index", render: (item: TransactionPresetType) => <Input value={item.level} /> },
    { label: "档位", key: "level", render: (item: TransactionPresetType) => <Input value={item.level} /> },
    { label: "买入价格", key: "buyTriggerPrice", render: (item: TransactionPresetType) => <Input value={item.buyTriggerPrice} /> },
    { label: "买入数量", key: "buyVolume", render: (item: TransactionPresetType) => <Input value={item.buyVolume} /> },
    { label: "买入金额", key: "buy1", render: (item: TransactionPresetType) => <Input value={item.buyVolume} /> },
    { label: "卖出价格", key: "sellTriggerPrice", render: (item: TransactionPresetType) => <Input value={item.sellTriggerPrice} /> },
    { label: "卖出数量", key: "sellVolume", render: (item: TransactionPresetType) => <Input value={item.sellVolume} /> },
    { label: "卖出金额", key: "sellVolume2", render: (item: TransactionPresetType) => <Input value={item.sellVolume} /> },
    { label: "留存数量", key: "sellVolume3", render: (item: TransactionPresetType) => <Input value={item.sellVolume} /> },
    { label: "留存利润", key: "sellVolume4", render: (item: TransactionPresetType) => <Input value={item.sellVolume} /> },
    { label: "收益", key: "profit", render: (item: TransactionPresetType) => <Input value={item.profit} /> },
    { label: "收益率", key: "profitRate", render: (item: TransactionPresetType) => <Input value={item.profitRate} /> },
  ];

  return (
    <Card className="w-[650px]  overflow-auto">
      <CardHeader>
        <CardTitle>Grid Trading Preset</CardTitle>
      </CardHeader>
      <CardContent>
        <SimpleTable columns={columns} data={presetDetail} />
      </CardContent>
    </Card>
  );
}
