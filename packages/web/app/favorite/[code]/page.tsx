"use client";

import WatchListIndex from "#components/watch-list";
import { LeftExpandableLayout, Aside, Header } from "#components/layout/left-expandable-layout";
import { Input } from "@shadcn/ui/input";
import { Separator } from "@shadcn/ui/separator";
import { useQueryState } from "nuqs";
import { SimpleTable } from "@shadcn/component";
import { transactionAction } from "#store";
import { use, useCallback, useEffect, useMemo, useState } from "react";
import { Button } from "@shadcn/ui/button";
import { transactionColumns } from "#components/record-columns";
import { genKlineOption, splitData, type KlineRecord, type DataType } from "#components/charts/kline-chart-option";
import ChartInstance from "#components/charts/chart-instance";
import { getKlineDataAction } from "#actions/index";
import Show from "@shadcn/component/show";

import { X } from "lucide-react";
import { last, pick } from "lodash-es";

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
  const transactions = transactionAction.getFilteredTransaction(code!);
  const records = transactions.map((item) => ({
    date: item.date,
    value: Number(item.price),
    quantity: Math.abs(item.quantity),
    type: item.quantity > 0 ? "B" : "S",
  }));

  return useMemo(
    () =>
      genKlineOption({
        data: splitData(klineData),
        records: records as KlineRecord[],
      }),
    [klineData, records]
  );
}
// TODO: 价格验证，买入不得高于当天最高价，卖出不得低于当天最低价
export default function Page({ params }: { params: Promise<{ code: string }> }) {
  const { code } = use(params);

  // store
  const strategyStore = transactionAction.useFilteredTransaction(code!);

  const klineData = useKlineData(code);
  const option = useKlineOption(klineData, code);

  const columns = useMemo(
    () => [
      ...transactionColumns((item: ITransactionRecord, param: { key: string; value: string }) =>
        transactionAction.updateTransaction({
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
                transactionAction.insertTransaction({
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
            <Button size="sm" variant="ghost" onClick={() => transactionAction.removeTransaction(item.id)}>
              删除
            </Button>
          );
        },
      },
    ],
    []
  );

  const insertOrUpdateTransaction = useCallback(
    async (params: ITransactionRecord) => {
      const lastRecord = last(transactionAction.getFilteredTransaction(code!));

      const isAllFilled = Object.values(pick(lastRecord, ["date", "price", "quantity"])).every((item) => item);

      if (isAllFilled) {
        transactionAction.insertTransaction({
          code: code!,
          date: params.date,
          price: params.price,
          quantity: 0,
        });
      } else {
        transactionAction.updateTransaction({
          ...lastRecord,
          code: code!,
          date: params.date,
          price: params.price,
          quantity: 0,
        });
      }
    },
    [code, strategyStore]
  );

  const onChartClick = (params: echarts.ECElementEvent) => {
    if (params.componentType === "series" && params.componentSubType === "candlestick") {
      const data = params?.value as number[];

      const detail = {
        date: params.name,
        price: data[1],
        quantity: 0,
      };

      insertOrUpdateTransaction(detail as ITransactionRecord);
    }
  };

  return (
    <div className="flex-1  p-2 relative overflow-hidden">
      <ChartInstance className="w-full h-1/2" option={option} onClick={onChartClick} />
      <SimpleTable className="w-full h-1/2" columns={columns} data={strategyStore} />
    </div>
  );
}
