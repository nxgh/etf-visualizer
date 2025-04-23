

import { useState } from "react";

import { Button } from "@shadcn/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@shadcn/ui/tabs";

import AddTransaction from "./add-transaction";

import { Transaction } from "@etf-visualizer/database";
import TransactionTable from "./transaction-table";

import { getTransactions } from "../../page";

export default async function PositionInfo({ code }: { code: string }) {
  // const [tab, setTab] = useState("my");

  const transactions = await getTransactions(code);

  return (
    <>
      {/* <Tabs defaultValue="my" className="w-[400px]" onValueChange={setTab}>
        <TabsList>
          <TabsTrigger value="my">我的持仓</TabsTrigger>
          <TabsTrigger value="manager">主理人持仓</TabsTrigger>
        </TabsList>
      </Tabs> */}

      {/* {tab === "my" ? ( */}
        <AddTransaction code={code} transactions={transactions} />
      {/* ) : (
        <TransactionTable editable={false} transactions={transactions as any} />
      )} */}
    </>
  );
}
