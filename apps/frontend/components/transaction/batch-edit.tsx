import { TransactionTypeMap } from "#store/transaction";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@radix-ui/react-dialog";
import { DialogHeader, DialogFooter } from "@shadcn/ui/dialog";
import { Textarea } from "@shadcn/ui/textarea";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { Button } from "react-day-picker";
import { IProps } from "./transaction-table";

const placeholder = `# CSV 格式 
日期,价格, 数量
2025-01-01, 100, +100 
2025/0102, 100, -100 
20250103, 100, +100 
2025-01-10, 100, -100`;

// 批量编辑
export default function BatchEdit({ transactions, onTransactionChange }: IProps) {
  useEffect(() => {
    console.log("transactions", transactions);
    setValue(transactions.map((item) => `${dayjs(item.timestamp).format("YYYY-MM-DD")},${item.price},${item.volume}`).join("\n"));
  }, [transactions]);

  const [open, setOpen] = useState(false);

  const [value, setValue] = useState("");

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
  );
}
