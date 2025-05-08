"use client";

import WatchListIndex from "#components/watch-list";
import { LeftExpandableLayout, Aside, Header } from "#components/layout/left-expandable-layout";
import { Input } from "@shadcn/ui/input";
import { Separator } from "@shadcn/ui/separator";
import { useQueryState } from "nuqs";
import { SimpleTable } from "@shadcn/component";
import { insertRecord, removeRecord, Store, useFilteredRecord, updateTransaction } from "#store";
import { use, useEffect, useMemo, useState } from "react";
import { Button } from "@shadcn/ui/button";
import { transactionColumns } from "#components/record-columns";
import { genKlineOption, splitData, type KlineRecord, type DataType } from "#components/charts/kline-chart-option";
import ChartInstance from "#components/charts/chart-instance";
import { getKlineDataAction } from "#actions/index";

function useKlineData(code: string) {
  const [data, setData] = useState<DataType[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getKlineDataAction(code);
      setData(data);
    };
    fetchData();
  }, [code]);

  return data;
}

function useKlineOption(klineData: DataType[], code: string) {
  const records: KlineRecord[] = [
    { date: "2023-05-10", value: 0.496, quantity: 100, type: "B" },
    { date: "2023-05-29", value: 0.491, quantity: 100, type: "B" },
    { date: "2023-06-13", value: 0.551, quantity: 100, type: "S" },
  ];

  const records2 = useFilteredRecord(code!);

  const r2 = useMemo(() => {
    return [
      ...records,
      ...records2.map((item) => ({
        date: item.date,
        value: Number(item.price),
        quantity: Math.abs(item.quantity),
        type: item.quantity > 0 ? "B" : "S",
      })),
    ];
  }, [records2]);

  return useMemo(
    () =>
      genKlineOption({
        data: splitData(klineData),
        records: r2 as KlineRecord[],
      }),
    [klineData, r2]
  );
}

export default function Page({ params }: { params: Promise<{ code: string }> }) {
  const { code } = use(params);

  // store
  const strategyStore = useFilteredRecord(code!);

  const klineData = useKlineData(code);
  const option = useKlineOption(klineData, code);

  const columns = useMemo(
    () => [
      ...transactionColumns((item: ITransactionRecord, param: { key: string; value: string }) =>
        updateTransaction({
          ...item,
          [param.key]: param.value,
        } as ITransactionRecord)
      ),
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
      <ChartInstance className="w-full h-1/2" option={option} />
      <SimpleTable className="w-full h-1/2" columns={columns} data={strategyStore} />
    </div>
  );
}
