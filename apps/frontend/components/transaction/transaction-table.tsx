import { Input } from "@shadcn/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@shadcn/ui/table";
import { Button } from "@shadcn/ui/button";
import dayjs from "dayjs";
import { DatePicker } from "@shadcn/ui/date-picker";
import { Pencil, FilePenLine, BadgeMinus, DiamondPlus, PackagePlus } from "lucide-react";
import { Decimal } from "decimal.js";

import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogHeader, DialogFooter } from "@shadcn/ui/dialog";
import { Textarea } from "@shadcn/ui/textarea";

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@shadcn/ui/tooltip";

import { TransactionTypeMap } from "#store/transaction";
import type { TransactionType } from "#store/transaction";

interface IProps {
  transactions: TransactionType[];
  editable: boolean;
  onTransactionChange?: (type: "insert" | "update" | "remove", data: TransactionType | TransactionType[]) => void;
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

export const getRowData = (): TransactionType => ({
  timestamp: dayjs().format("YYYY-MM-DD"),
  price: "",
  volume: "",
  amount: "",
  remark: "",
  profit: "",
  profit_rate: "",
  id: Date.now(),
  createAt: Date.now(),
  level: "",
});

const placeholder = `# CSV 格式 
日期,价格, 数量
2025-01-01, 100, +100 
2025/0102, 100, -100 
20250103, 100, +100 
2025-01-10, 100, -100`;

export const calcAmount = (price: string | number, volume: string | number) => {
  return new Decimal(Number(price)).mul(new Decimal(Math.abs(Number(volume)))).toNumber();
};

export default function TransactionTable({ transactions, editable, onTransactionChange }: IProps) {
  const [open, setOpen] = useState(false);

  const [value, setValue] = useState("");

  useEffect(() => {
    setValue(transactions.map((item) => `${dayjs(item.timestamp).format("YYYY-MM-DD")},${item.price},${item.volume}`).join("\n"));
  }, [transactions]);

  function addTransaction() {
    onTransactionChange?.("insert", getRowData());
  }

  function edit(id: number, key: string, value: string | number | Date, index: number) {
    onTransactionChange?.("update", { ...transactions[index], [key]: value });
  }

  function removeTransaction(transaction: TransactionType) {
    onTransactionChange?.("remove", transaction);
  }

  function onConfirm() {
    const v = value
      .replaceAll("，", ",")
      .split("\n")
      .map((item) => item.split(",").map((item) => item.trim()));

    const newData = v.map((item, index) => ({
      timestamp: dayjs(item?.[0] || "").format("YYYY-MM-DD"),
      price: Number(item?.[1]) || ("" as const),
      volume: Number(item?.[2]) || ("" as const),
      type: Number(item?.[2]) > 0 ? TransactionTypeMap.buy : TransactionTypeMap.sell,
      profit: 0,
      profit_rate: 0,
      id: Date.now() + index,
      createAt: Date.now() + index,
      level: "" as const,
      remark: "",
    }));
    //

    onTransactionChange?.("insert", newData);

    setValue("");
    setOpen(false);
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-min-[200px]">日期</TableHead>
            <TableHead className="w-min-[100px]"></TableHead>
            <TableHead className="w-min-[200px]">价格</TableHead>
            <TableHead className="w-min-[200px]">数量</TableHead>
            <TableHead className="w-min-[200px]">金额</TableHead>
            <TableHead className="w-min-[100px]">收益</TableHead>
            <TableHead className="w-min-[100px]">收益率</TableHead>
            <TableHead className="w-min-[100px]">备注</TableHead>

            {editable && (
              <TableHead className="w-[50px] flex">
                <TooltipProvider>
                  <ToolTipIcon label="编辑">
                    <DiamondPlus onClick={() => addTransaction()} />
                  </ToolTipIcon>
                  <ToolTipIcon label="批量编辑">
                    <PackagePlus onClick={() => setOpen(true)} />
                  </ToolTipIcon>
                </TooltipProvider>
              </TableHead>
            )}
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.map((transaction, index) => (
            <TableRow key={transaction.id}>
              <TableCell className="font-medium">
                {editable ? (
                  <DatePicker
                    className="h-8"
                    value={dayjs(transaction.timestamp).toDate()}
                    onSelect={(date) => edit(transaction.id, "timestamp", date, index)}
                  />
                ) : (
                  dayjs(transaction.timestamp).format("YYYY-MM-DD")
                )}
              </TableCell>
              <TableCell>
                {Number(transaction.volume) > 0 && <span className="text-green-500 bg-green-100 rounded-md px-2 py-1">买入</span>}
                {Number(transaction.volume) < 0 && <span className="text-red-500 bg-red-100 rounded-md px-2 py-1">卖出</span>}
              </TableCell>
              <TableCell>
                {editable ? (
                  <Input
                    type="number"
                    className="h-8"
                    value={transaction.price}
                    onChange={(e) => edit(transaction.id, "price", Number(e.target.value), index)}
                  />
                ) : (
                  transaction.price
                )}
              </TableCell>
              <TableCell>
                {editable ? (
                  <Input
                    type="number"
                    className="h-8"
                    value={transaction.volume}
                    onChange={(e) => edit(transaction.id, "volume", Number(e.target.value), index)}
                  />
                ) : (
                  transaction.volume
                )}
              </TableCell>
              <TableCell>{calcAmount(transaction.price, transaction.volume)}</TableCell>
              <TableCell>{transaction.profit ? transaction.profit : ""}</TableCell>
              <TableCell>{transaction.profit_rate ? `${transaction.profit_rate}%` : ""}</TableCell>
              <TableCell>
                {editable ? (
                  <Input value={transaction.remark} onChange={(e) => edit(transaction.id, "remark", e.target.value, index)} />
                ) : (
                  transaction.remark
                )}
              </TableCell>
              {editable && (
                <TableCell>
                  <Button variant="link" className="text-red-500" size="sm" onClick={() => removeTransaction(transaction)}>
                    <BadgeMinus />
                  </Button>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="w-[600px] max-w-3xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-lxgw">批量编辑</DialogTitle>
            <DialogDescription>
              <Textarea
                value={value}
                onChange={(e) => setValue(e.target.value)}
                className="font-lxgw !text min-h-[200px]"
                placeholder={placeholder}
              />
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={onConfirm}>确定</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
