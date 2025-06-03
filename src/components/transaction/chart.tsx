"use client";

import { use, useCallback, useEffect, useMemo, useState } from "react";
import { genKlineOption, splitData, type KlineRecord, type DataType } from "#components/transaction/kline-chart-option";
import ChartInstance from "#components/charts/chart-instance";
import { getSecurityDetailAction } from "#actions/index";

import { transactionStoreAction } from "#stores/modules/transaction";
import dayjs from "dayjs";
import { last, pick } from "lodash-es";
import type { TransactionRecord } from "#stores/types/transaction";

function useKlineOption(code: string) {
  const transactions = transactionStoreAction.use.transaction();

  const [data, setData] = useState<DataType[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getSecurityDetailAction(code);
      setData(
        data.kline?.rows.map((item) => ({
          date: dayjs(item[1]).format("YYYY-MM-DD"),
          open: item[3],
          high: item[4],
          low: item[5],
          close: item[6],
          volume: item[2],
        })) || []
      );
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
        onTooltipFormatter: (params) => {
          console.log(params);
        },
      }),
    [data, transactionRecords]
  );
}

// TODO: 价格验证，买入不得高于当天最高价，卖出不得低于当天最低价
export function TransactionChart({ code }: { code: string }) {
  // store
  const strategyStore = transactionStoreAction.use.transaction();
  const insertTransaction = transactionStoreAction.use.insert();
  const updateTransaction = transactionStoreAction.use.update();

  const option = useKlineOption(code);

  const insertOrUpdateTransaction = useCallback(
    async (params: TransactionRecord) => {
      const lastRecord = last(strategyStore);

      const isAllFilled = Object.values(pick(lastRecord, ["date", "price", "quantity"])).every((item) => item);

      if (isAllFilled) {
        insertTransaction({
          code: code!,
          date: params.date,
          price: params.price,
          quantity: 0,
        });
      } else {
        updateTransaction({
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

      insertOrUpdateTransaction(detail as TransactionRecord);
    }
  };

  return <ChartInstance className="w-full h-1/2" option={option} onClick={onChartClick} />;
}
