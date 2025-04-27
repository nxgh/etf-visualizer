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
import { type IGridLevelRecord, generateGrid } from "#store/model";
import SimpleTable from "@shadcn/component/table";
import { Button } from "@shadcn/ui/button";
import { columnEnums, getColumns } from "#components/grid-trading-preset/strategy-columns";

const TabEnum = createEnums({ my: "我的", manager: "主理人" } as const);

export default function Transaction({ className }: { className?: string }) {
  const [tab, setTab] = useState<GetCreateEnumsKeyType<typeof TabEnum>>(TabEnum.my.key);

  const transactions = useTransactionStore((state) => state.transactions);
  const insertTransaction = useTransactionStore((state) => state.insertTransaction);
  const updateTransaction = useTransactionStore((state) => state.updateTransaction);
  const removeTransaction = useTransactionStore((state) => state.removeTransaction);

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
    ...getColumns((item, key, value) => {
      console.log(item, key, value);
    }),
    {
      label: "操作",
      key: "action",
      render: (item: IGridLevelRecord) => (
        <Button variant="destructive" onClick={() => removeTransaction(item)}>
          删除
        </Button>
      ),
    },
  ];

  return (
    <SimpleCard className={cn("w-[1600px]", className)} title="交易记录">
      <div className="flex justify-between">
        <Tabs defaultValue="my" className="w-[400px]" onValueChange={onTabChange}>
          <TabsList>
            <TabsTrigger value={TabEnum.my.key}>{TabEnum.my.value}</TabsTrigger>
            <TabsTrigger value={TabEnum.manager.value}>{TabEnum.manager.value}</TabsTrigger>
          </TabsList>
        </Tabs>

        <Button onClick={() => insertTransaction()}>添加</Button>
      </div>

      <SimpleTable columns={columns} data={transactions} />
      {/* <TransactionTable editable={tab === "my"} transactions={transactions} onTransactionChange={onTransactionChange} /> */}
    </SimpleCard>
  );
}
