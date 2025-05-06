"use client";

import { columnEnums, getColumns } from "#components/grid-trading-preset/strategy-preset-columns";
import { useFilteredRecord, addTransactionItem, removeRecord } from "#store";
import { SimpleTable } from "@shadcn/component";
import { Button } from "@shadcn/ui/button";
import { FileUp, ListPlus } from "lucide-react";
import { use, useMemo } from "react";

export default function TradeRecordPage({ params }: { params: Promise<{ code: string }> }) {
  const resolvedParams = use(params);

  // store
  const dataSource = useFilteredRecord(resolvedParams.code);

  const onTableChange = (item: ITradRecord, key: keyof ITradRecord, value: string) => {};

  const columns = useMemo(
    () => [
      ...getColumns(onTableChange),
      {
        key: "action",
        label: "",
        title: "操作",
        width: 100,
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
    <div className="p-4">
      <div className="flex justify-end gap-2">
        <Button
          size="sm"
          onClick={() =>
            addTransactionItem({
              code: resolvedParams.code,
            })
          }
        >
          <ListPlus />
          添加
        </Button>
        <Button size="sm">
          <FileUp />
          导入
        </Button>
      </div>
      <SimpleTable columns={columns} data={dataSource} />
    </div>
  );
}
