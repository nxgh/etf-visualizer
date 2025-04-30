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
import { useSearchParams } from "next/navigation";

const TabEnum = createEnums({ my: "我的", manager: "主理人" } as const);

export default function TransactionPresetTable({ className }: { className?: string }) {
  const [tab, setTab] = useState<GetCreateEnumsKeyType<typeof TabEnum>>(TabEnum.my.key);

  const sp = useSearchParams();

  const query_transaction = Store.use.query_transaction();
  const updateTransaction = Store.use.update_transaction();
  const removeTransaction = Store.use.remove_transaction();

  const onTableChange = (item: IGridLevelRecord, key: keyof IGridLevelRecord, value: string) => {
    updateTransaction({
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
        <Button variant="destructive" onClick={() => removeTransaction(String(item.id))}>
          删除
        </Button>
      ),
    },
  ];

  return (
    <SimpleTable
      className={cn("w-full h-full", className)}
      columns={columns}
      data={sp.get("code") ? query_transaction(sp.get("code")!) : []}
    />
  );
}
