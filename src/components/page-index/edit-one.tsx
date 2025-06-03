"use client";

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@shadcn/ui/dialog";
import { Button } from "@shadcn/ui/button";
import { Input } from "@shadcn/ui/input";
import { DatePicker } from "@shadcn/antd/date-picker";
import { InputNumber } from "@shadcn/antd/input-number";
import { SimpleSelect } from "@shadcn/component";
import { Store } from "#store";
import { useState } from "react";
import dayjs from "dayjs";

export function EditOne({ children }: { children: React.ReactNode }) {
  const watchList = Store.watchListStoreAction.use.watchList();

  const [form, setForm] = useState<{
    code: string;
    name: string;
    date: string;
    price: string;
    amount: string;
    type: string;
  }>({
    code: "",
    name: "",
    date: "",
    price: "",
    amount: "",
    type: "",
  });

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="w-[600px] max-w-3xl">
        <DialogHeader>
          <DialogTitle className="text-xl">编辑</DialogTitle>
          <DialogDescription>编辑</DialogDescription>
        </DialogHeader>

        <SimpleSelect
          placeholder="代码"
          options={watchList.map((item) => ({ label: item.name, value: item.code }))}
          value={form.code}
          onValueChange={(e, option) => {
            setForm({ ...form, code: option.value, name: option.label });
          }}
        />
        <Input type="text" placeholder="代码" disabled value={form.code} />
        <DatePicker
          placeholder="日期"
          value={form.date ? dayjs(form.date) : undefined}
          onChange={(e) => setForm({ ...form, date: e.format("YYYY-MM-DD") })}
        />
        <InputNumber placeholder="价格" value={form.price} onChange={(e) => setForm({ ...form, price: e.toString() })} />
        <InputNumber placeholder="数量" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.toString() })} />
        <SimpleSelect placeholder="分类" options={[]} value={form.type} onValueChange={(e) => setForm({ ...form, type: e })} />

        {/* <Input type="text" placeholder="止损价格" />
        <Input type="text" placeholder="止盈价格" />
        <Input type="text" placeholder="买入价格" />
        <Input type="text" placeholder="卖出价格" /> */}

        <DialogFooter>
          <Button
            onClick={() => {
              console.log("form", form);
            }}
          >
            保存
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
