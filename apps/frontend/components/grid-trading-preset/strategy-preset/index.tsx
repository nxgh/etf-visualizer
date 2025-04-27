import { useEffect, useState } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@shadcn/ui/card";
import { Input } from "@shadcn/ui/input";
import createEnums from "#utils/createEnums";
import { Table, SimpleTableHeader, SimpleTableBody, TableCell, TableRow } from "@shadcn/component/table";

import { generateTransactionPreset, type TransactionPresetType } from "./gen-tran-preset";
import { useQueryState, parseAsString } from "nuqs";
import { useSearchParams } from "next/navigation";
import { useWatchListStore, useGridTradeStrategyStore } from "#store/index";
import GridLevelRecord from "./preset-data.helper";
import type GridLevelRecordType from "./preset-data";
import Decimal from "decimal.js";
import { TableFooter } from "@shadcn/ui/table";

const InputWrapper = ({ children, ...props }: React.ComponentProps<typeof Input>) => {
  return;
};

export default function TransactionPresetTable() {
  const searchParams = useSearchParams();
  const [strategyId, setStrategyId] = useQueryState("strategy", parseAsString.withDefault(searchParams.get("strategy") ?? ""));

  const [presetDetail, setPresetDetail] = useState<GridLevelRecordType[]>([]);

  const strategyStore = useGridTradeStrategyStore((state) => state.presetList);

  useEffect(() => {
    const strategy = strategyStore.find((item) => item.id === Number(strategyId));
    if (strategyId && strategy) {
      const transactions = GridLevelRecord.generate(strategy);
      setPresetDetail(transactions);
    }
  }, [strategyId, strategyStore]);

  function updatePresetDetail(row: GridLevelRecordType, columnKey: keyof GridLevelRecordType, value: string) {
    const newPresetDetail = presetDetail.map((item) => {
      if (item.positionIndex === row.positionIndex) {
        return { ...item, [columnKey]: value };
      }
      return item;
    });

    setPresetDetail(newPresetDetail);
  }

  const columns = [
    {
      label: "序号",
      key: "positionIndex",
      headerClassName: "w-[50px]",
      render: (item: GridLevelRecordType) => <div>{item.positionIndex}</div>,
    },
    { label: "档位", key: "level" },
    { label: "买入价格", key: "buyPrice" },
    { label: "买入数量", key: "buyQuantity" },
    {
      label: "买入金额",
      key: "buyAmount",
      headerClassName: "w-[100px]",
      render: (item: GridLevelRecordType) => (
        <div className="bg-gray-100 p-1 flex justify-center items-center rounded-md text-green-300">
          {new Decimal(item.buyPrice).mul(item.buyQuantity).toFixed(2)}
        </div>
      ),
    },
    { label: "卖出价格", key: "sellPrice" },
    { label: "卖出数量", key: "sellQuantity" },
    {
      label: "卖出金额",
      key: "sellAmount",
      headerClassName: "w-[100px]",
      render: (item: GridLevelRecordType) => (
        <div className="bg-gray-100 p-1 flex justify-center items-center rounded-md text-red-300">
          {new Decimal(item.sellPrice).mul(item.sellQuantity).toFixed(2)}
          {/* {GridLevelRecord.calculateSellAmount(item.sellPrice, item.buyQuantity)} */}
        </div>
      ),
    },
    {
      label: "留存数量",
      key: "remainingQuantity",
      headerClassName: "w-[100px]",
      render: (item: GridLevelRecordType) => <div>{new Decimal(item.buyQuantity).sub(item.sellQuantity).toFixed(2)}</div>,
    },
    {
      label: "留存利润",
      key: "retainedProfit",
      headerClassName: "w-[100px]",
      render: (item: GridLevelRecordType) => (
        <div>{new Decimal(item.buyQuantity).sub(item.sellQuantity).mul(item.sellPrice).toFixed(2)}</div>
      ),
    },
    { label: "收益", key: "profit" },
    { label: "收益率", key: "yieldRate" },
  ].map((column) => ({
    ...column,
    render: (item: GridLevelRecordType) =>
      column?.render && typeof column.render === "function" ? (
        column?.render(item)
      ) : (
        <Input
          type="number"
          className="border-none shadow-none ring-0 focus-visible:ring-1"
          value={item[column.key as keyof GridLevelRecordType]}
          onChange={(e) => {
            updatePresetDetail(item, column.key as keyof GridLevelRecordType, e.target.value);
          }}
        />
      ),
  }));

  return (
    <Card className="w-[1200px]  overflow-auto">
      <CardHeader>
        <CardTitle>Grid Trading Preset Template</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <SimpleTableHeader columns={columns} />
          <SimpleTableBody columns={columns} data={presetDetail} />
          <TableFooter>
            <TableRow>
              <TableCell colSpan={4}>Total</TableCell>
              <TableCell colSpan={3} className="">
                {/* 买入金额 */}
                {presetDetail
                  .reduce((acc, item) => {
                    return acc.add(new Decimal(item.buyPrice).mul(item.buyQuantity));
                  }, new Decimal(0))
                  .toFixed(2)}
              </TableCell>
              <TableCell className="">
                {/* 卖出金额 */}

                {presetDetail
                  .reduce((acc, item) => {
                    return acc.add(new Decimal(item.sellPrice).mul(item.sellQuantity));
                  }, new Decimal(0))
                  .toFixed(2)}
              </TableCell>
              <TableCell colSpan={2} className="">
                {/* 留存数量 */}
                {presetDetail
                  .reduce((acc, item) => {
                    return acc.add(new Decimal(item.buyQuantity).sub(item.sellQuantity));
                  }, new Decimal(0))
                  .toFixed(2)}
              </TableCell>
              <TableCell className="">
                {/* 收益 */}
                {presetDetail
                  .reduce((acc, item) => {
                    return acc.add(new Decimal(item.profit));
                  }, new Decimal(0))
                  .toFixed(2)}
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </CardContent>
    </Card>
  );
}
