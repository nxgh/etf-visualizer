"use client";
import Decimal from "decimal.js";
import { cn } from "@shadcn/lib/utils";
import dayjs from "dayjs";

import { Button } from "@shadcn/ui/button";
import { InputNumber } from "@shadcn/antd/input-number";
import { DatePicker } from "@shadcn/antd/date-picker";
import { Table } from "@shadcn/antd/table";

import type { TableProps } from "antd";
import type { TransactionRecord } from "#stores/types/type";

import { transactionStoreAction } from "#stores/modules/transaction";
import createEnums from "#utils/createEnums";
import type { ColumnsType } from "antd/es/table";
import { Plus } from "lucide-react";

const columns: ColumnsType<TransactionRecord> = [
  {
    title: "档位",
    key: "level",
    dataIndex: "level",
    align: "center",
    width: "8%",
  },
  {
    title: "日期",
    key: "date",
    dataIndex: "date",
    align: "center",
    width: "20%",
  },
  {
    title: "价格",
    key: "price",
    width: "15%",
    dataIndex: "price",
    align: "center",
  },
  {
    title: "数量",
    key: "quantity",
    width: "15%",
    dataIndex: "quantity",
    align: "center",
  },
  {
    title: "金额",
    key: "amount",
    width: "15%",
    dataIndex: "amount",
    align: "center",
  },
  // {
  //   title: "来源",
  //   key: "source",
  //   width: 100,
  //   dataIndex: "source",
  //   align: "center",
  // },
] as const;

export interface TransactionTableProps {
  className?: string;
  code?: string;
  editable?: boolean;
  dataSource: TransactionRecord[];
  insertTransaction: (code: string) => void;
  removeTransaction: (id: string) => void;
  updateTransaction: (item: TransactionRecord) => void;
  onChange: (item: TransactionRecord, param: { key: string; value: string }) => void;
}

export function TransactionTable({
  className,
  code,
  editable = true,
  dataSource,
  insertTransaction,
  removeTransaction,
  updateTransaction,
}: TransactionTableProps) {
  // const dataSource = transactionStoreAction.use.transaction();
  // const insertTransaction = transactionStoreAction.use.insert();
  // const updateTransaction = transactionStoreAction.use.update();
  // const removeTransaction = transactionStoreAction.use.remove();

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
          className="!border-none"
          value={dayjs(item.date)}
          onChange={(day) =>
            onChange(item, {
              key: columns[1].key as string,
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
          className="!border-none [&>.ant-input-number-input-wrap>input]:text-center"
          changeOnWheel
          min={0.001}
          step={0.001}
          value={item.price}
          onChange={(value) =>
            onChange(item, {
              key: columns[2].key as string,
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
          className="!border-none [&>.ant-input-number-input-wrap>input]:text-center"
          changeOnWheel
          step={1}
          value={item.quantity}
          onChange={(value) =>
            onChange(item, {
              key: columns[3].key as string,
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
    // {
    //   ...columns[5],
    //   render: (_, item: TransactionRecord) => item.source,
    // },
    {
      key: "action",
      width: "10%",
      dataIndex: "action",
      align: "center",
      title: () => {
        return (
          <div className="flex justify-center items-center">
            <Plus className="cursor-pointer text-red-300" onClick={() => insertTransaction({ code })} />
          </div>
        );
      },
      render: (_, item: TransactionRecord) => {
        return (
          <span className="text-red-500 hover:text-red-300 cursor-pointer" onClick={() => removeTransaction(item.id)}>
            删除
          </span>
        );
      },
    },
  ];

  return (
    <Table<TransactionRecord>
      size="small"
      className={cn("w-full h-[25vh]", className)}
      scroll={{ y: 200 }}
      columns={editable ? editableColumns : columns}
      dataSource={dataSource.map((item) => ({ ...item, key: item.id }))}
      // pagination={{
      //   total: dataSource.length,
      //   pageSize: 10,
      // }}
      pagination={false}
    />
  );
}
