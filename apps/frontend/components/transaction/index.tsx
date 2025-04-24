"use client";
import { useState } from "react";

import { Tabs, TabsList, TabsTrigger } from "@shadcn/ui/tabs";

import TransactionTable from "./transaction-table";
import { createEnums } from "#utils/createEnums";
import type { GetCreateEnumsKeyType } from "#utils/createEnums";

import { cn } from "@shadcn/lib/utils";

import { useTransactionStore } from "#store/transaction";
import type { TransactionType, TransactionTypeMap } from "#store/transaction";

const TabEnum = createEnums({ my: "我的", manager: "主理人" } as const);

export default function Transaction({ className }: { className?: string }) {
  const [tab, setTab] = useState<GetCreateEnumsKeyType<typeof TabEnum>>(TabEnum.my.key);

  const transactions = useTransactionStore((state) => state.transactions);
  const insertTransactions = useTransactionStore((state) => state.insertTransactions);
  const updateTransaction = useTransactionStore((state) => state.updateTransaction);
  const removeTransaction = useTransactionStore((state) => state.removeTransaction);

  const onTransactionChange = (type: "insert" | "update" | "remove", data: TransactionType | TransactionType[]) => {
    if (type === "insert") {
      insertTransactions(data as TransactionType[]);
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

  return (
    <div className={cn("w-full", className)}>
      <Tabs defaultValue="my" className="w-[400px]" onValueChange={onTabChange}>
        <TabsList>
          <TabsTrigger value={TabEnum.my.key}>{TabEnum.my.value}</TabsTrigger>
          <TabsTrigger value={TabEnum.manager.value}>{TabEnum.manager.value}</TabsTrigger>
        </TabsList>
      </Tabs>
      <TransactionTable editable={tab === "my"} transactions={transactions} onTransactionChange={onTransactionChange} />
    </div>
  );
}
