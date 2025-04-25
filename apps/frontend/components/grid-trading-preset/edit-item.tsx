import { useState } from "react";

import { Button } from "@shadcn/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@shadcn/ui/card";
import { Input } from "@shadcn/ui/input";
import { Label } from "@shadcn/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@shadcn/ui/select";
import { Show } from "#components/show";
import createEnums from "#utils/createEnums";
import type { GetCreateEnumsValueType, GetCreateEnumsKeyType } from "#utils/createEnums";
import Decimal from "decimal.js";
import SimpleTable from "#components/table";
import { Badge } from "@shadcn/ui/badge";

import generateTransactionPreset from "./gen-tran-preset";

const TransactionType = createEnums({
  buy: "买入",
  sell: "卖出",
} as const);

type Transaction = { triggerPrice: number; type: GetCreateEnumsValueType<typeof TransactionType> };

export default function CardWithForm() {
  const [form, setForm] = useState<{
    name: string;

    basePrice: string;
    rise: string;
    fall: string;
    level: string;
    step: string;
  }>({
    name: "",
    basePrice: "",
    rise: "",
    fall: "",
    level: "",
    step: "",
  });

  const [presetDetail, setPresetDetail] = useState<Transaction[]>([]);

  const updateForm = (key: keyof typeof form, value: string) => {
    setForm({ ...form, [key]: value });
  };

  const setDetail = () => {
    // type === fixed, 根据涨幅、跌幅、基准价，生成 详情

    const transactions = generateTransactionPreset(Number(form.basePrice), Number(form.rise), Number(form.fall));
    console.log(transactions);
    setPresetDetail(transactions);
  };

  const columns = [
    { label: "档位", key: "level", render: (item: Transaction) => <Input value={item.level} /> },
    { label: "买入触发价格", key: "triggerPrice", render: (item: Transaction) => <Input value={item.triggerPrice} /> },
    { label: "卖出触发价格", key: "triggerPrice", render: (item: Transaction) => <Input value={item.triggerPrice} /> },
  ];

  return (
    <>
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Grid Trading Preset</CardTitle>
        </CardHeader>
        <CardContent>
          <form>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  placeholder="Name of your project"
                  value={form.name}
                  onChange={(e) => updateForm("name", e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="basePrice">基准价格</Label>
                <Input id="basePrice" type="number" value={form.basePrice} onChange={(e) => updateForm("basePrice", e.target.value)} />
              </div>

              <div>
                <Label htmlFor="rise">涨幅</Label>
                <Input id="rise" type="number" value={form.rise} onChange={(e) => updateForm("rise", e.target.value)} />
              </div>
              <div>
                <Label htmlFor="fall">跌幅</Label>
                <Input id="fall" type="number" value={form.fall} onChange={(e) => updateForm("fall", e.target.value)} />
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline">Cancel</Button>
          <Button onClick={setDetail}>Deploy</Button>
        </CardFooter>
      </Card>

      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Grid Trading Preset</CardTitle>
        </CardHeader>
        <CardContent>
          <SimpleTable columns={columns} data={presetDetail} />
        </CardContent>
      </Card>
    </>
  );
}
