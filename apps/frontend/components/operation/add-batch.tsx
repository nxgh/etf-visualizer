import { Textarea } from "@shadcn/ui/textarea";
import { DatePicker } from "@shadcn/ui/date-picker";
import { Input } from "@shadcn/ui/input";
import { Button } from "@shadcn/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@shadcn/ui/dialog";

import { useState } from "react";
const placeholder = `# CSV 格式 日期, 数量, 备注
2025-01-01, +100, 备注
2025/0102, -100, 备注
20250103, +100, 备注
2025-01-10, -100, 备注`;

import { Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@shadcn/ui/table";
import dayjs from "dayjs";

interface RowData {
  date: Date;
  amount: number | "";
  remark: string;
  $id: number;
}

const getRowData = (): RowData => ({
  date: new Date(),
  amount: "",
  remark: "",
  $id: Date.now(),
});

export function TableDemo() {
  const [invoices, setInvoices] = useState<RowData[]>([getRowData()]);
  const [value, setValue] = useState("");
  const [open, setOpen] = useState(false);
  function edit($id: number, key: string, value: any, index: number) {
    const newInvoices = invoices.map((invoice) => ($id === invoice.$id ? { ...invoice, [key]: value } : invoice));

    // 如果是最后一行被编辑，则添加新行
    if (index === invoices.length - 1) {
      newInvoices.push(getRowData());
    }

    setInvoices(newInvoices);
  }

  function onConfirm() {
    const v = value
      .replaceAll("，", ",")
      .split("\n")
      .map((item) => item.split(",").map((item) => item.trim()));

    let newData = v.map((item, index) => ({
      date: dayjs(item?.[0] || "").toDate(),
      amount: Number(item?.[1] || ""),
      remark: item?.[2] || "",
      $id: Date.now() + index,
    }));
    //
    setInvoices((data) => [...data, ...newData]);

    setOpen(false);
    setValue("");
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Date</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Remark</TableHead>
            <TableHead>
              <DialogTrigger>批量编辑</DialogTrigger>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {invoices.map((invoice, index) => (
            <TableRow key={invoice.$id}>
              <TableCell className="font-medium">
                <DatePicker value={invoice.date} onSelect={(date) => edit(invoice.$id, "date", date, index)} />
              </TableCell>
              <TableCell>
                <Input type="number" value={invoice.amount} onChange={(e) => edit(invoice.$id, "amount", Number(e.target.value), index)} />
              </TableCell>
              <TableCell>
                <Input value={invoice.remark} onChange={(e) => edit(invoice.$id, "remark", e.target.value, index)} />
              </TableCell>
              <TableCell>
                {index > 0 && (
                  <Button
                    variant="link"
                    className="text-red-500"
                    size="sm"
                    onClick={() => setInvoices(invoices.filter(({ $id }) => $id !== invoice.$id))}
                  >
                    删除
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        {/* <TableFooter>
        <TableRow>
          <TableCell colSpan={3}>Total</TableCell>
          <TableCell className="text-right">$2,500.00</TableCell>
        </TableRow>
      </TableFooter> */}
      </Table>

      <DialogContent className="w-[600px] max-w-3xl">
        <DialogHeader>
          <DialogTitle>批量编辑</DialogTitle>
          <DialogDescription>
            <Textarea
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="font-lxgw !text-xl min-h-[200px]"
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

export default function AddBatch() {
  return (
    <div>
      <TableDemo />
    </div>
  );
}
