"use client";
import Decimal from "decimal.js";
import { cn } from "@shadcn/lib/utils";
import dayjs from "dayjs";

import { Button } from "@shadcn/ui/button";
import { InputNumber } from "@shadcn/antd/input-number";
import { DatePicker } from "@shadcn/antd/date-picker";
import { Table } from "antd";

import type { TableProps } from "antd";
import type { TransactionRecord } from "#stores/types/type";

import { transactionStoreAction } from "#stores/modules/transaction";
import createEnums from "#utils/createEnums";
import type { ColumnsType } from "antd/es/table";

const transactionColumnMap = {
  level: "档位",
  date: "日期",
  price: "价格",
  quantity: "数量",
  amount: "金额",
  source: "来源",
} as const;
export const TransactionColumnEnums = createEnums(transactionColumnMap);

const columns: ColumnsType<TransactionRecord> = [
  {
    title: TransactionColumnEnums.level.value,
    key: TransactionColumnEnums.level.key,
    dataIndex: TransactionColumnEnums.level.key,
    align: "center",
  },
  {
    title: TransactionColumnEnums.date.value,
    key: TransactionColumnEnums.date.key,
    dataIndex: TransactionColumnEnums.date.key,
    align: "center",
  },
  {
    title: TransactionColumnEnums.price.value,
    key: TransactionColumnEnums.price.key,
    dataIndex: TransactionColumnEnums.price.key,
    align: "center",
  },
  {
    title: TransactionColumnEnums.quantity.value,
    key: TransactionColumnEnums.quantity.key,
    dataIndex: TransactionColumnEnums.quantity.key,
    align: "center",
  },
  {
    title: TransactionColumnEnums.amount.value,
    key: TransactionColumnEnums.amount.key,
    dataIndex: TransactionColumnEnums.amount.key,
    align: "center",
  },
  {
    title: TransactionColumnEnums.source.value,
    key: TransactionColumnEnums.source.key,
    dataIndex: TransactionColumnEnums.source.key,
    align: "center",
  },
  {
    key: "action",
    dataIndex: "action",
  },
];

export function TransactionTable({ className, code, editable = true }: { className?: string; code: string; editable?: boolean }) {
  const dataSource = transactionStoreAction.use.transaction();
  const insertTransaction = transactionStoreAction.use.insert();
  const updateTransaction = transactionStoreAction.use.update();
  const removeTransaction = transactionStoreAction.use.remove();

  const onChange = (item: TransactionRecord, param: { key: string; value: string }) => {
    updateTransaction({
      ...item,
      [param.key]: param.value,
    } as TransactionRecord);
  };

  const editableColumns: TableProps<TransactionRecord>["columns"] = [
    {
      ...columns[0],
      render: (_, item: TransactionRecord) => item.level,
    },
    {
      ...columns[1],
      render: (_, item: TransactionRecord) => (
        <DatePicker
          value={dayjs(item.date)}
          onChange={(day) =>
            onChange(item, {
              key: TransactionColumnEnums.date.key,
              value: dayjs(day).format("YYYY-MM-DD"),
            })
          }
        />
      ),
    },
    {
      ...columns[2],
      render: (_, item: TransactionRecord) => (
        <InputNumber
          style={{ width: 200 }}
          min={0.001}
          step={0.001}
          value={item.price}
          onChange={(value) =>
            onChange(item, {
              key: TransactionColumnEnums.price.key,
              value: value?.toString() ?? "",
            })
          }
          stringMode
        />
      ),
    },
    {
      ...columns[3],
      render: (_, item: TransactionRecord) => (
        <InputNumber<number>
          style={{ width: 200 }}
          step={1}
          value={item.quantity}
          onChange={(value) =>
            onChange(item, {
              key: TransactionColumnEnums.quantity.key,
              value: value?.toString() ?? "",
            })
          }
          stringMode
        />
      ),
    },
    {
      ...columns[4],
      render: (_, item: TransactionRecord) => (
        <div
          className={cn(
            "p-1 flex justify-center items-center rounded-md",
            item.price && item.quantity ? "bg-gray-100" : "",
            item.quantity > 0 ? "text-green-400" : "text-red-400"
          )}
        >
          {item.price && item.quantity ? new Decimal(item.price).mul(Math.abs(item.quantity)).toFixed(2) : ""}
        </div>
      ),
    },
    {
      ...columns[5],
      render: (_, item: TransactionRecord) => item.source,
    },
    {
      ...columns[6],
      title: () => {
        return (
          <Button size="sm" variant="outline" onClick={() => insertTransaction({ code })}>
            添加
          </Button>
        );
      },
      render: (_, item: TransactionRecord) => {
        return (
          <Button className="text-red-500" size="sm" variant="ghost" onClick={() => removeTransaction(item.id)}>
            删除
          </Button>
        );
      },
    },
  ];

  return (
    <Table<TransactionRecord>
      size="small"
      className={cn("w-full h-1/2", className)}
      columns={editable ? editableColumns : columns}
      dataSource={dataSource.map((item) => ({ ...item, key: item.id }))}
      pagination={{
        total: dataSource.length,
        pageSize: 10,
      }}
    />
  );
}
