"use client";

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@shadcn/ui/dialog";
import { Button } from "@shadcn/ui/button";
import { Input } from "@shadcn/ui/input";
import { DatePicker } from "@shadcn/antd/date-picker";
import { InputNumber } from "@shadcn/antd/input-number";
import { SimpleSelect } from "@shadcn/component";
import { Store } from "#store";
import { useState } from "react";
import { TimePicker } from "antd";

import dayjs from "dayjs";
import type { TransactionRecord } from "#stores/types/transaction";
import { Switch } from "@shadcn/ui/switch";

export function EditOne({ children }: { children: React.ReactNode }) {
  const watchList = Store.watchListStoreAction.use.watchList();

  const insertTransaction = Store.transactionStoreAction.use.insert();

  const [form, setForm] = useState<Partial<TransactionRecord> & { time: string; direction: -1 | 1 }>({
    code: "",
    name: "",
    date: "",
    price: 0,
    quantity: 0,
    category: "",
    remark: "",
    time: "",
    profit: 0,
    fee: 0,
    profitRate: 0,
    level: "",
    direction: 1,
  });

  function insert() {
    console.log(form);

    const date = `${form.date} ${form.time}`;

    try {
      insertTransaction({ ...form, date });
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="w-[600px] max-w-3xl">
        <DialogHeader>
          <DialogTitle className="text-xl">编辑</DialogTitle>
          <DialogDescription>编辑</DialogDescription>
        </DialogHeader>

        <SimpleSelect
          placeholder="产品"
          options={watchList.map((item) => ({ label: item.name, value: item.code }))}
          value={form.code ?? ""}
          onValueChange={(e, option) => {
            setForm({ ...form, code: option.value, name: option.label });
          }}
        />
        <Input type="text" placeholder="代码" disabled value={form.code} />

        <div className="flex gap-2 w-full">
          <DatePicker
            placeholder="日期"
            value={form.date ? dayjs(form.date) : undefined}
            onChange={(e) => setForm({ ...form, date: e.format("YYYY-MM-DD") })}
            className="w-1/2"
          />
          <TimePicker
            placeholder="时间"
            onChange={(e) => setForm({ ...form, time: e.format("HH:mm:ss") })}
            defaultOpenValue={dayjs("00:00:00", "HH:mm:ss")}
            className="w-1/2"
          />
        </div>

        <div className="flex items-center gap-2">
          操作
          <Switch checked={form.direction === 1} onCheckedChange={(e) => setForm({ ...form, direction: e ? 1 : -1 })} />
        </div>

        <Input placeholder="档位" value={form.level} onChange={(e) => setForm({ ...form, level: e.target.value })} />

        <InputNumber
          placeholder="价格"
          value={form.price === 0 ? undefined : form.price}
          onChange={(e) => setForm({ ...form, price: e ?? 0 })}
        />
        <InputNumber
          placeholder="数量"
          value={form.quantity === 0 ? undefined : form.quantity}
          onChange={(e) => setForm({ ...form, quantity: e ?? 0 })}
        />
        <InputNumber placeholder="费用" value={form.fee === 0 ? undefined : form.fee} onChange={(e) => setForm({ ...form, fee: e ?? 0 })} />

        <InputNumber
          placeholder="利润"
          value={form.profit === 0 ? undefined : form.profit}
          onChange={(e) => setForm({ ...form, profit: e ?? 0 })}
        />
        <InputNumber
          placeholder="利润率"
          value={form.profitRate === 0 ? undefined : form.profitRate}
          onChange={(e) => setForm({ ...form, profitRate: e ?? 0 })}
        />

        <SimpleSelect
          placeholder="分类"
          options={[{ label: "默认", value: "default" }]}
          value={form.category ?? ""}
          onValueChange={(e) => setForm({ ...form, category: e })}
        />

        <Input type="text" placeholder="备注" value={form.remark} onChange={(e) => setForm({ ...form, remark: e.target.value })} />
        <DialogFooter>
          <Button onClick={insert}>保存</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
