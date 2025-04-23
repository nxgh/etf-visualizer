import { Input } from "@shadcn/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@shadcn/ui/table";
import { Button } from "@shadcn/ui/button";
import dayjs from "dayjs";
import { DatePicker } from "@shadcn/ui/date-picker";
import { ChartBarStacked } from "lucide-react";

import { Transaction } from "@etf-visualizer/database";
import { useState } from "react";
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogHeader, DialogFooter } from "@shadcn/ui/dialog";
import { Textarea } from "@shadcn/ui/textarea";

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@shadcn/ui/tooltip";

interface RowData {
  timestamp: Date;
  price: number | "";
  volume: number | "";
  profit: number | "";
  profit_rate: number | "";

  $id: number;
  id: number;
  createAt: number;
}

interface IProps {
  transactions: RowData[];
  editable: boolean;
  onTransactionChange?: (data: RowData[]) => void;
}

export const getRowData = (): RowData => ({
  timestamp: new Date(),
  price: "",
  volume: "",
  profit: "",
  profit_rate: "",
  $id: Date.now(),
  createAt: Date.now(),
  id: Date.now(),
});

const placeholder = `# CSV 格式 
日期, 数量
2025-01-01, +100 
2025/0102, -100 
20250103, +100 
2025-01-10, -100`;

export default function TransactionTable({ transactions, editable, onTransactionChange }: IProps) {
  const [open, setOpen] = useState(false);

  const [value, setValue] = useState("");

  function edit($id: number, key: string, value: any, index: number) {
    // 如果是最后一行被编辑，则添加新行
    if (index === transactions.length - 1) {
      onTransactionChange && onTransactionChange([...transactions, getRowData()]);
    }

    onTransactionChange && onTransactionChange(transactions.map((item) => (item.$id === $id ? { ...item, [key]: value } : item)));
  }

  function removeTransaction($id: number) {
    onTransactionChange && onTransactionChange(transactions.filter((item) => item.$id !== $id));
  }

  function onConfirm() {
    const v = value
      .replaceAll("，", ",")
      .split("\n")
      .map((item) => item.split(",").map((item) => item.trim()));

    let newData = v.map((item, index) => ({
      timestamp: dayjs(item?.[0] || "").toDate(),
      price: Number(item?.[1] || ""),
      volume: Number(item?.[2] || ""),
      profit: 0,
      profit_rate: 0,
      $id: Date.now() + index,
      id: Date.now() + index,
      createAt: Date.now() + index,
    }));
    //

    onTransactionChange && onTransactionChange([...transactions, ...newData]);

    setValue("");
    setOpen(false);
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Remark</TableHead>
            <TableHead>Profit</TableHead>
            <TableHead>Profit Rate</TableHead>

            {editable && (
              <TableHead className="w-[50px]" onClick={() => setOpen(true)}>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <ChartBarStacked />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>批量编辑</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </TableHead>
            )}
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.map((transaction, index) => (
            <TableRow key={transaction.$id || transaction.id}>
              <TableCell className="font-medium">
                {editable ? (
                  <DatePicker value={transaction.timestamp} onSelect={(date) => edit(transaction.$id, "timestamp", date, index)} />
                ) : (
                  dayjs(transaction.timestamp).format("YYYY-MM-DD")
                )}
              </TableCell>
              <TableCell>
                {editable ? (
                  <Input
                    type="number"
                    value={transaction.price}
                    onChange={(e) => edit(transaction.$id, "price", Number(e.target.value), index)}
                  />
                ) : (
                  transaction.price
                )}
              </TableCell>
              <TableCell>
                {editable ? (
                  <Input
                    type="number"
                    value={transaction.volume}
                    onChange={(e) => edit(transaction.$id, "volume", Number(e.target.value), index)}
                  />
                ) : (
                  transaction.volume
                )}
              </TableCell>

              <TableCell>{transaction.profit ? transaction.profit : ""}</TableCell>
              <TableCell>{transaction.profit_rate ? `${transaction.profit_rate}%` : ""}</TableCell>
              {editable && (
                <TableCell>
                  {index > 0 && (
                    <Button variant="link" className="text-red-500" size="sm" onClick={() => removeTransaction(transaction.$id)}>
                      删除
                    </Button>
                  )}
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
