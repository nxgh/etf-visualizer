"use client";

import WatchListIndex from "#components/watch-list";
import { LeftExpandableLayout, Aside, Header } from "#components/layout/left-expandable-layout";
import { Input } from "@shadcn/ui/input";
import { Separator } from "@shadcn/ui/separator";
import { useQueryState } from "nuqs";
import { SimpleTable } from "@shadcn/component";
import { insertRecord, removeRecord, Store, useFilteredRecord, updateTransaction } from "#store";
import { use, useMemo } from "react";
import { Button } from "@shadcn/ui/button";
import { transactionColumns } from "#components/record-columns";
import Chart from "#components/charts/kline-chart";

export default function Page({ params }: { params: Promise<{ code: string }> }) {
  const { code } = use(params);

  // store
  const strategyStore = useFilteredRecord(code!);

  const onTableChange = (item: ITransactionRecord, param: { key: string; value: string }) => {
    updateTransaction({
      ...item,
      [param.key]: param.value,
    } as ITransactionRecord);
  };

  const columns = useMemo(
    () => [
      ...transactionColumns(onTableChange),
      {
        key: "action",
        label: "",
        title: "操作",
        headerClassName: "w-[150px]",
        headerRender: () => {
          return (
            <Button
              size="sm"
              variant="outline"
              onClick={() =>
                insertRecord({
                  code: code!,
                })
              }
            >
              添加
            </Button>
          );
        },
        render: (item: ITradRecord) => {
          return (
            <Button size="sm" variant="ghost" onClick={() => removeRecord(item.id)}>
              删除
            </Button>
          );
        },
      },
    ],
    []
  );

  return (
    <div className="flex-1 overflow-scroll p-2">
      <Chart className="w-full h-1/2" />
      <SimpleTable className="w-full h-1/2" columns={columns} data={strategyStore} />
    </div>
  );
}
