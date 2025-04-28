"use client";
import { useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "@shadcn/ui/tabs";

import { createEnums } from "#utils/createEnums";
import type { GetCreateEnumsKeyType } from "#utils/createEnums";

import { cn } from "@shadcn/lib/utils";

import Store from "#store";
import type { IGridLevelRecord } from "#store";

import { SimpleCard, SimpleTable } from "@shadcn/component";
import { Button } from "@shadcn/ui/button";
import { getColumns } from "#components/grid-trading-preset/strategy-preset-columns";

const TabEnum = createEnums({ my: "我的", manager: "主理人" } as const);

export default function Transaction({ className }: { className?: string }) {
  const [tab, setTab] = useState<GetCreateEnumsKeyType<typeof TabEnum>>(TabEnum.my.key);

  const transactions = Store.transactionStore.getState();

  const insertEmpty = () => {
    console.log("insertEmpty", transactions);
    Store.transactionStore.insertEmpty();
  };

  const onTabChange = (value: string) => {
    setTab(value as GetCreateEnumsKeyType<typeof TabEnum>);
  };

  const onTableChange = (item: IGridLevelRecord, key: keyof IGridLevelRecord, value: string) => {
    Store.transactionStore.updateTransaction({
      ...item,
      [key]: value,
    } as IGridLevelRecord);
  };

  const columns = [
    ...getColumns(onTableChange),
    {
      label: "操作",
      key: "action" as const,
      render: (item: IGridLevelRecord) => (
        <Button variant="destructive" onClick={() => Store.transactionStore.removeTransaction(item)}>
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

        <Button onClick={insertEmpty}>添加</Button>
      </div>

      <SimpleTable columns={columns} data={transactions} />
    </SimpleCard>
  );
}
