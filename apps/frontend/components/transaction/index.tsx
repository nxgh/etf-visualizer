"use client";
import { useState } from "react";

import { Button } from "@shadcn/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@shadcn/ui/tabs";

import TransactionTable from "./transaction-table";

export default function Transaction() {
  const [tab, setTab] = useState("my");
  const [transactions, setTransactions] = useState([]);

  const onTransactionChange = (transactions: any) => {
    console.log("onTransactionChange", transactions);
    setTransactions(transactions);
  };

  return (
    <div className="w-full">
      <Tabs defaultValue="my" className="w-[400px]" onValueChange={setTab}>
        <TabsList>
          <TabsTrigger value="my">我的持仓</TabsTrigger>
          <TabsTrigger value="manager">主理人持仓</TabsTrigger>
        </TabsList>
      </Tabs>
      <TransactionTable editable={tab === "my"} transactions={transactions as any} onTransactionChange={onTransactionChange} />
    </div>
  );
}
