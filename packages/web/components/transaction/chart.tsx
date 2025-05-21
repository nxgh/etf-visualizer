"use client";

import { use, useEffect, useMemo, useState } from "react";
import { genKlineOption, splitData, type KlineRecord, type DataType } from "#components/charts/kline-chart-option";
import ChartInstance from "#components/charts/chart-instance";
import { getKlineDataAction } from "#actions/index";

import { transactionStoreAction } from "#stores/modules/transaction";

function useKlineOption(code: string) {
  const transactions = transactionStoreAction.use.transaction();

  const [data, setData] = useState<DataType[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getKlineDataAction(code);
      setData(data);
    };
    fetchData();
  }, [code]);

  const transactionRecords = transactions.map((item) => ({
    date: item.date,
    value: Number(item.price),
    quantity: Math.abs(item.quantity),
    type: item.quantity > 0 ? "B" : "S",
  }));

  return useMemo(
    () =>
      genKlineOption({
        data: splitData(data),
        records: transactionRecords as KlineRecord[],
      }),
    [data, transactionRecords]
  );
}

// TODO: 价格验证，买入不得高于当天最高价，卖出不得低于当天最低价
export function TransactionChart({ code }: { code: string }) {
  // store
  //   const strategyStore = transactionAction.useFilteredTransaction(code!);

  const option = useKlineOption(code);

  //   const insertOrUpdateTransaction = useCallback(
  //     async (params: TransactionRecord) => {
  //       const lastRecord = last(transactionAction.getFilteredTransaction(code!));

  //       const isAllFilled = Object.values(pick(lastRecord, ["date", "price", "quantity"])).every((item) => item);

  //       if (isAllFilled) {
  //         transactionAction.insertTransaction({
  //           code: code!,
  //           date: params.date,
  //           price: params.price,
  //           quantity: 0,
  //         });
  //       } else {
  //         transactionAction.updateTransaction({
  //           ...lastRecord,
  //           code: code!,
  //           date: params.date,
  //           price: params.price,
  //           quantity: 0,
  //         });
  //       }
  //     },
  //     [code, strategyStore]
  //   );

  const onChartClick = (params: echarts.ECElementEvent) => {
    if (params.componentType === "series" && params.componentSubType === "candlestick") {
      const data = params?.value as number[];

      const detail = {
        date: params.name,
        price: data[1],
        quantity: 0,
      };

      //   insertOrUpdateTransaction(detail as TransactionRecord);
    }
  };

  return <ChartInstance className="w-full h-1/2" option={option} onClick={onChartClick} />;
}
