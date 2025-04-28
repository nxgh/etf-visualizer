import type { IGridLevelRecord } from "#store";
import createEnums, { type GetCreateEnumsKeyType } from "#utils/createEnums";
import { Input } from "@shadcn/ui/input";
import { Decimal } from "decimal.js";

export const columnEnums = createEnums({
  positionIndex: "序号",
  level: "档位",
  buyDate: "买入时间",
  buyPrice: "买入价格",
  buyQuantity: "买入数量",
  buyAmount: "买入金额",
  sellDate: "卖出时间",
  sellPrice: "卖出价格",
  sellQuantity: "卖出数量",
  sellAmount: "卖出金额",
  remainingQuantity: "留存数量",
  retainedProfit: "留存利润",
  profit: "收益",
  yieldRate: "收益率",
} as const);

interface IColumns {
  label: string;
  key: GetCreateEnumsKeyType<typeof columnEnums>;
  headerClassName?: string;
  render?: (item: IGridLevelRecord) => React.ReactNode;
}

type onChangeType = (item: IGridLevelRecord, key: keyof IGridLevelRecord, value: string) => void;

export const getColumns = (onChange: onChangeType) => {
  const columns: IColumns[] = [
    {
      label: columnEnums.positionIndex.value,
      key: columnEnums.positionIndex.key,
      headerClassName: "w-[50px]",
      render: (item: IGridLevelRecord) => <div>{item.positionIndex}</div>,
    },
    { label: columnEnums.level.value, key: columnEnums.level.key },
    { label: columnEnums.buyDate.value, key: columnEnums.buyDate.key },
    { label: columnEnums.buyPrice.value, key: columnEnums.buyPrice.key },
    { label: columnEnums.buyQuantity.value, key: columnEnums.buyQuantity.key },
    {
      label: columnEnums.buyAmount.value,
      key: columnEnums.buyAmount.key,
      headerClassName: "w-[100px]",
      render: (item: IGridLevelRecord) => (
        <div className="bg-gray-100 p-1 flex justify-center items-center rounded-md text-green-300">
          {new Decimal(item.buyPrice).mul(item.buyQuantity).toFixed(2) ?? ""}
        </div>
      ),
    },
    { label: columnEnums.sellDate.value, key: columnEnums.sellDate.key },
    { label: columnEnums.sellPrice.value, key: columnEnums.sellPrice.key },
    { label: columnEnums.sellQuantity.value, key: columnEnums.sellQuantity.key },
    {
      label: columnEnums.sellAmount.value,
      key: columnEnums.sellAmount.key,
      headerClassName: "w-[100px]",
      render: (item: IGridLevelRecord) => (
        <div className="bg-gray-100 p-1 flex justify-center items-center rounded-md text-red-300">
          {new Decimal(item.sellPrice ?? 0).mul(item.sellQuantity ?? 0).toFixed(2)}
        </div>
      ),
    },
    {
      label: columnEnums.remainingQuantity.value,
      key: columnEnums.remainingQuantity.key,
      headerClassName: "w-[100px]",
      render: (item: IGridLevelRecord) => <div>{new Decimal(item.buyQuantity ?? 0).sub(item.sellQuantity ?? 0).toFixed(2)}</div>,
    },
    {
      label: columnEnums.retainedProfit.value,
      key: columnEnums.retainedProfit.key,
      headerClassName: "w-[100px]",
      render: (item: IGridLevelRecord) => (
        <div>
          {new Decimal(item.buyQuantity ?? 0)
            .sub(item.sellQuantity ?? 0)
            .mul(item.sellPrice ?? 0)
            .toFixed(2)}
        </div>
      ),
    },
    { label: columnEnums.profit.value, key: columnEnums.profit.key },
    { label: columnEnums.yieldRate.value, key: columnEnums.yieldRate.key },
  ];

  const result = columns.map((column) => ({
    ...column,
    render: (item: IGridLevelRecord) =>
      column?.render && typeof column.render === "function" ? (
        column?.render(item)
      ) : (
        <Input
          type="number"
          className="border-none shadow-none ring-0 focus-visible:ring-1"
          value={item[column.key as keyof IGridLevelRecord] || ""}
          onChange={(e) => {
            onChange(item, column.key as keyof IGridLevelRecord, e.target.value);
          }}
        />
      ),
  }));

  return result;
};
