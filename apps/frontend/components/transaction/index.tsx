"use client";
import { useState } from "react";
import Decimal from "decimal.js";
import { Input } from "@shadcn/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@shadcn/ui/tabs";

import TransactionTable from "./transaction-table";
import { createEnums } from "#utils/createEnums";
import type { GetCreateEnumsKeyType } from "#utils/createEnums";

import { cn } from "@shadcn/lib/utils";

import { useTransactionStore } from "#store/transaction";
import type { TransactionType, TransactionTypeMap } from "#store/transaction";

import type { IProps } from "./transaction-table";
import SimpleCard from "@shadcn/component/card";
import GridLevelRecordType from "#components/grid-trading-preset/strategy-preset/preset-data";
import SimpleTable from "@shadcn/component/table";
import { Button } from "@shadcn/ui/button";

const TabEnum = createEnums({ my: "我的", manager: "主理人" } as const);

export default function Transaction({ className }: { className?: string }) {
  const [tab, setTab] = useState<GetCreateEnumsKeyType<typeof TabEnum>>(TabEnum.my.key);

  const transactions = useTransactionStore((state) => state.transactions);
  const insertTransaction = useTransactionStore((state) => state.insertTransaction);
  const updateTransaction = useTransactionStore((state) => state.updateTransaction);
  const removeTransaction = useTransactionStore((state) => state.removeTransaction);

  const transactions = [];

  const onTransactionChange: IProps["onTransactionChange"] = (type, data) => {
    if (type === "insert") {
      insertTransaction();
    }
    if (type === "update") {
      updateTransaction(data as TransactionType);
    }
    if (type === "remove") {
      removeTransaction(data as TransactionType);
    }
  };

  const onTabChange = (value: string) => {
    setTab(value as GetCreateEnumsKeyType<typeof TabEnum>);
  };

  const columns = [
    {
      label: "序号",
      key: "positionIndex",
      headerClassName: "w-[50px]",
      render: (item: GridLevelRecordType) => <div>{item.positionIndex}</div>,
    },
    { label: "档位", key: "level" },
    { label: "买入价格", key: "buyPrice" },
    { label: "买入时间", key: "buyTime" },
    { label: "买入数量", key: "buyQuantity" },
    {
      label: "买入金额",
      key: "buyAmount",
      headerClassName: "w-[100px]",
      render: (item: GridLevelRecordType) => (
        <div className="bg-gray-100 p-1 flex justify-center items-center rounded-md text-green-300">
          {new Decimal(item?.buyPrice).mul(item?.buyQuantity).toFixed(2)}
        </div>
      ),
    },
    { label: "卖出时间", key: "sellTime" },
    { label: "卖出价格", key: "sellPrice" },
    { label: "卖出数量", key: "sellQuantity" },
    {
      label: "卖出金额",
      key: "sellAmount",
      headerClassName: "w-[100px]",
      render: (item: GridLevelRecordType) => (
        <div className="bg-gray-100 p-1 flex justify-center items-center rounded-md text-red-300">
          {new Decimal(item?.sellPrice).mul(item?.sellQuantity).toFixed(2)}
        </div>
      ),
    },
    {
      label: "留存数量",
      key: "remainingQuantity",
      headerClassName: "w-[100px]",
      render: (item: GridLevelRecordType) => <div>{new Decimal(item?.buyQuantity).sub(item?.sellQuantity).toFixed(2)}</div>,
    },
    {
      label: "留存利润",
      key: "retainedProfit",
      headerClassName: "w-[100px]",
      render: (item: GridLevelRecordType) => (
        <div>{new Decimal(item?.buyQuantity).sub(item?.sellQuantity).mul(item?.sellPrice).toFixed(2)}</div>
      ),
    },
    { label: "收益", key: "profit" },
    { label: "收益率", key: "yieldRate" },
  ].map((column) => ({
    ...column,
    render: (item: GridLevelRecordType) =>
      column?.render && typeof column.render === "function" ? (
        column?.render(item)
      ) : (
        <Input
          type="number"
          className="border-none shadow-none ring-0 focus-visible:ring-1"
          value={item[column.key as keyof GridLevelRecordType]}
          onChange={(e) => {
            // onChange(item, column.key as keyof GridLevelRecordType, e.target.value);
          }}
        />
      ),
  }));

  return (
    <SimpleCard className={cn("w-[1200px]", className)} title="交易记录">
      <div className="flex justify-between">
        <Tabs defaultValue="my" className="w-[400px]" onValueChange={onTabChange}>
          <TabsList>
            <TabsTrigger value={TabEnum.my.key}>{TabEnum.my.value}</TabsTrigger>
            <TabsTrigger value={TabEnum.manager.value}>{TabEnum.manager.value}</TabsTrigger>
          </TabsList>
        </Tabs>

        <Button onClick={() => {}}>添加</Button>
      </div>

      <SimpleTable columns={columns} data={transactions} />
      {/* <TransactionTable editable={tab === "my"} transactions={transactions} onTransactionChange={onTransactionChange} /> */}
    </SimpleCard>
  );
}
