import { useEffect, useMemo, useState } from "react";
import { omit } from "lodash-es";
import { useQueryState, parseAsString } from "nuqs";
import { useSearchParams } from "next/navigation";

import { cn } from "@shadcn/lib/utils";
import { Button } from "@shadcn/ui/button";
import { Input } from "@shadcn/ui/input";
import { Label } from "@shadcn/ui/label";
import SimpleCard from "@shadcn/component/card";
import SimpleSelect from "@shadcn/component/select";

import Store, { type IGridTradeStrategyConfig, createStrategy } from "#store";
// import { useWatchListStore, useGridTradeStrategyStore } from "#store/index";

interface FormRowsType {
  label: string;
  key: keyof IGridTradeStrategyConfig;
  type?: "text" | "number" | "switch";
  value?: string | number | boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  render?: (row: FormRowsType) => React.ReactNode;
}

export default function TransactionPresetSetting({ className }: { className?: string }) {
  const searchParams = useSearchParams();
  const [strategyId, setStrategyId] = useQueryState("strategy", parseAsString.withDefault(searchParams.get("strategy") ?? ""));

  const strategyStore = Store.presetListStore.getState();
  const watchList = Store.watchListStore.getState();

  const [form, setForm] = useState<IGridTradeStrategyConfig>(createStrategy());

  useEffect(() => {
    const strategy = strategyStore.find((item) => item.id === Number(strategyId));
    if (strategyId && strategy) {
      setForm(strategy);
    }
  }, [strategyId, strategyStore]);

  const updateForm = (key: keyof IGridTradeStrategyConfig, value: string | number | boolean) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const isExist = useMemo(() => strategyStore.find((item) => item.id === form.id), [form, strategyStore]);

  const setDetail = () => {
    if (isExist) {
      // update(form);
      Store.presetListStore.updatePreset(form);
      return;
    }
    // insert(form);
    Store.presetListStore.insert(form);
  };

  const options = watchList.map((item) => {
    return {
      label: item.name,
      value: item.code,
    };
  });

  const FormRows: FormRowsType[] = [
    {
      label: "网格名称",
      key: "gridName",
      type: "text",
      value: form.gridName,
      onChange: (e) => updateForm("gridName", e.target.value),
    },
    {
      label: "交易品种",
      key: "tradingPair",
      render: () => {
        return (
          <SimpleSelect
            placeholder="请选择交易品种"
            options={options}
            value={form.tradingPair ?? ""}
            onValueChange={(e, option) => {
              !form.gridName && updateForm("gridName", `${option.label}`);
              option?.value && updateForm("tradingPair", option.value);
            }}
          />
        );
      },
    },
    {
      label: "基准价格",
      key: "basePrice",
      type: "number",
      value: form.basePrice,
      onChange: (e) => updateForm("basePrice", Number(e.target.valueAsNumber)),
    },
    {
      label: "买入数量",
      key: "buyVolume",
      type: "number",
      value: form.buyVolume,
      onChange: (e) => updateForm("buyVolume", Number(e.target.valueAsNumber)),
    },
    {
      label: "涨幅 (%)",
      key: "priceIncrease",
      type: "number",
      value: form.priceIncrease,
      onChange: (e) => updateForm("priceIncrease", Number(e.target.valueAsNumber)),
    },
    {
      label: "跌幅 (%)",
      key: "priceDecline",
      type: "number",
      value: form.priceDecline,
      onChange: (e) => updateForm("priceDecline", Number(e.target.valueAsNumber)),
    },
    {
      label: "压力测试",
      key: "stressTest",
      type: "number",
      value: form.stressTest,
      onChange: (e) => updateForm("stressTest", Number(e.target.valueAsNumber)),
    },
    {
      label: "逐格加码",
      key: "gridStepIncrement",
      type: "number",
      value: form.gridStepIncrement,
      onChange: (e) => updateForm("gridStepIncrement", Number(e.target.valueAsNumber)),
    },
    {
      label: "利润留存 (%)",
      key: "profitRetention",
      type: "number",
      value: form.profitRetention,
      onChange: (e) => updateForm("profitRetention", Number(e.target.valueAsNumber)),
    },
  ];

  const formComplete = useMemo(() => {
    const requiredFields = omit(form, ["stressTest", "gridStepIncrement", "profitRetention"]);
    const res = Object.values(requiredFields).every((item) => {
      if (typeof item === "number") {
        return item > 0;
      }
      return item !== "" && item !== undefined;
    });

    return !res;
  }, [form]);

  function onCancel() {
    setStrategyId(null);
    setForm(createStrategy());
  }

  return (
    <SimpleCard
      className={cn("w-[350px]", className)}
      title="网格交易预设"
      footer={
        <>
          <Button variant="outline" onClick={onCancel}>
            取消
          </Button>
          <Button disabled={formComplete} onClick={setDetail}>
            {isExist ? "更新" : "添加"}预设
          </Button>
        </>
      }
    >
      <form onSubmit={(e) => e.preventDefault()}>
        <div className="grid w-full items-center gap-4">
          {FormRows.map((row) => (
            <div key={row.key} className="flex flex-col space-y-1.5">
              <Label htmlFor={row.key}>{row.label}</Label>
              {row?.render ? (
                row?.render(row)
              ) : (
                <Input
                  id={row.key}
                  type={row.type}
                  placeholder={row.type === "text" ? `${row.label}` : undefined}
                  value={row.value as string}
                  onChange={row.onChange}
                />
              )}
            </div>
          ))}
        </div>
      </form>
    </SimpleCard>
  );
}
