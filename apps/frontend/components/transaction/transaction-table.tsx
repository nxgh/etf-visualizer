import dayjs from "dayjs";
import { Decimal } from "decimal.js";
import { BadgeMinus, ListPlus } from "lucide-react";

import { Button } from "@shadcn/ui/button";
import { DatePicker } from "@shadcn/ui/date-picker";
import { Input } from "@shadcn/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@shadcn/ui/table";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@shadcn/ui/tooltip";

import { Show } from "@shadcn/component/show";
import SimpleTable from "@shadcn/component/table";

import type { TransactionType } from "#store/transaction";

import { cn } from "@shadcn/lib/utils";
export interface IProps {
  transactions: TransactionType[];
  editable: boolean;
  onTransactionChange?: (type: "insert" | "update" | "remove", data?: TransactionType | TransactionType[]) => void;
}

function ToolTipIcon({ children, label }: { children: React.ReactNode; label: string }) {
  return (
    <Tooltip>
      <TooltipTrigger>{children}</TooltipTrigger>
      <TooltipContent>
        <p>{label}</p>
      </TooltipContent>
    </Tooltip>
  );
}

export const calcAmount = (price: string | number, volume: string | number) => {
  return new Decimal(Number(price)).mul(new Decimal(Math.abs(Number(volume)))).toNumber();
};

export default function TransactionTable({ transactions, editable, onTransactionChange }: IProps) {
  function addTransaction() {
    onTransactionChange?.("insert");
  }

  function edit(id: number, key: string, value: string | number | Date, index: number) {
    onTransactionChange?.("update", { ...transactions[index], [key]: value });
  }

  function removeTransaction(transaction: TransactionType) {
    onTransactionChange?.("remove", transaction);
  }

  const columns = [
    {
      label: "档位",
      key: "level",
      className: "w-[90px]",
      render: (transaction: TransactionType, index: number) => (
        <Show when={editable} fallback={transaction.level}>
          <Input type="text" value={transaction.level} onChange={(e) => edit(transaction.id, "level", e.target.value, index)} />
        </Show>
      ),
    },
    {
      label: "日期",
      key: "timestamp",
      render: (transaction: TransactionType, index: number) => (
        <Show when={editable} fallback={dayjs(transaction.timestamp).format("YYYY-MM-DD")}>
          <DatePicker
            className="h-8"
            value={dayjs(transaction.timestamp).toDate()}
            onSelect={(date) => edit(transaction.id, "timestamp", date, index)}
          />
        </Show>
      ),
    },
    {
      label: "价格",
      key: "price",
      render: (transaction: TransactionType, index: number) => (
        <Show when={editable} fallback={transaction.price}>
          <Input type="number" value={transaction.price} onChange={(e) => edit(transaction.id, "price", Number(e.target.value), index)} />
        </Show>
      ),
    },
    {
      label: "数量",
      key: "volume",
      render: (transaction: TransactionType, index: number) => (
        <Show when={editable} fallback={transaction.volume}>
          <Input type="number" value={transaction.volume} onChange={(e) => edit(transaction.id, "volume", Number(e.target.value), index)} />
        </Show>
      ),
    },
    {
      label: "金额",
      key: "amount",
      render: (transaction: TransactionType, index: number) => calcAmount(transaction.price, transaction.volume),
    },
    {
      label: "收益",
      key: "profit",
      render: (transaction: TransactionType, index: number) => (
        <Show when={editable} fallback={transaction.profit}>
          <Input type="number" value={transaction.profit} onChange={(e) => edit(transaction.id, "profit", Number(e.target.value), index)} />
        </Show>
      ),
    },
    {
      label: "收益率",
      key: "profit_rate",
      render: (transaction: TransactionType, index: number) => (
        <Show when={editable} fallback={transaction.profit_rate}>
          <Input
            type="number"
            value={transaction.profit_rate}
            onChange={(e) => edit(transaction.id, "profit_rate", Number(e.target.value), index)}
          />
        </Show>
      ),
    },
    {
      label: "备注",
      key: "remark",
      render: (transaction: TransactionType, index: number) => (
        <Show when={editable} fallback={transaction.remark}>
          <Input type="text" value={transaction.remark} onChange={(e) => edit(transaction.id, "remark", e.target.value, index)} />
        </Show>
      ),
    },
    {
      label: "操作",
      key: "action",
      headerRender: () => {
        return (
          <TooltipProvider>
            <ToolTipIcon label="编辑">
              <ListPlus onClick={() => addTransaction()} />
            </ToolTipIcon>
            {/* <ToolTipIcon label="批量编辑"> */}
            {/* <PackagePlus onClick={() => setOpen(true)} /> */}
            {/* </ToolTipIcon> */}
          </TooltipProvider>
        );
      },
      render: (transaction: TransactionType, index: number) => (
        <Show when={editable}>
          <Button variant="link" className="text-red-500" size="sm" onClick={() => removeTransaction(transaction)}>
            <BadgeMinus />
          </Button>
        </Show>
      ),
    },
  ];

  return <SimpleTable columns={columns} data={transactions} />;
}
