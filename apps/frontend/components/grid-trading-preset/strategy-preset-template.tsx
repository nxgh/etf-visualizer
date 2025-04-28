import { useEffect, useState } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@shadcn/ui/card";
import { Input } from "@shadcn/ui/input";
import { Table, SimpleTableHeader, SimpleTableBody, TableCell, TableRow } from "@shadcn/component/table";

import { useQueryState, parseAsString } from "nuqs";
import { useSearchParams } from "next/navigation";
import Store, { type IGridLevelRecord, generateGrid } from "#store";

import Decimal from "decimal.js";
import { TableFooter } from "@shadcn/ui/table";
import { cn } from "@shadcn/lib/utils";
import { columnEnums, getColumns } from "./strategy-preset-columns";
export default function TransactionPresetTable({ className }: { className?: string }) {
  const searchParams = useSearchParams();
  const [strategyId, setStrategyId] = useQueryState("strategy", parseAsString.withDefault(searchParams.get("strategy") ?? ""));

  const [presetDetail, setPresetDetail] = useState<IGridLevelRecord[]>([]);

  const strategyStore = Store.presetListStore.getState();

  useEffect(() => {
    const strategy = strategyStore.find((item) => item.id === Number(strategyId));
    // console.log("strategy", strategy, strategyStore);
    if (strategyId && strategy) {
      const transactions = generateGrid(strategy);
      setPresetDetail(transactions);
    }
  }, [strategyId, strategyStore]);

  function updatePresetDetail(row: IGridLevelRecord, columnKey: keyof IGridLevelRecord, value: string) {
    const newPresetDetail = presetDetail.map((item) => {
      if (item.positionIndex === row.positionIndex) {
        return { ...item, [columnKey]: value };
      }
      return item;
    });

    setPresetDetail(newPresetDetail);
  }

  const columns = getColumns(updatePresetDetail).filter(
    (column) => column.key !== columnEnums.buyDate.key && column.key !== columnEnums.sellDate.key
  );

  return (
    <Card className={cn("w-[1200px]  overflow-auto", className)}>
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
                    return acc.add(new Decimal(item.sellPrice ?? 0).mul(item.sellQuantity ?? 0));
                  }, new Decimal(0))
                  .toFixed(2)}
              </TableCell>
              <TableCell colSpan={2} className="">
                {/* 留存数量 */}
                {presetDetail
                  .reduce((acc, item) => {
                    return acc.add(new Decimal(item.buyQuantity ?? 0).sub(item.sellQuantity ?? 0));
                  }, new Decimal(0))
                  .toFixed(2)}
              </TableCell>
              <TableCell className="">
                {/* 收益 */}
                {presetDetail
                  .reduce((acc, item) => {
                    return acc.add(new Decimal(item.profit ?? 0));
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
