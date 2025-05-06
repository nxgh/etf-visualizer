import { use, useEffect, useMemo, useState } from "react";
import { omit, pick } from "lodash-es";
import { useQueryState, parseAsString } from "nuqs";
import { useSearchParams } from "next/navigation";

import { cn } from "@shadcn/lib/utils";
import { Button } from "@shadcn/ui/button";
import { Input } from "@shadcn/ui/input";
import { Label } from "@shadcn/ui/label";
import SimpleCard from "@shadcn/component/card";
import SimpleSelect from "@shadcn/component/select";

import Store, { type IGridTradeStrategyConfig, createStrategy } from "#store";
import { useParams } from "next/navigation";
import { Slider } from "@shadcn/ui/slider";
import InputNumber from "@shadcn/component/input-number";
interface FormRowsType {
  label: string;
  key: keyof IGridTradeStrategyConfig;
  type?: "text" | "number" | "switch";

  render?: (row: FormRowsType) => React.ReactNode;
  renderProps?: {
    min?: number;
    max?: number;
    step?: number;
    value: number;
    onChange: (value: number) => void;
  };
}

interface IProps {
  className?: string;
  // onPreview?: (form: IGridTradeStrategyConfig) => void;
}

export function usePresetSetting() {
  const watchList = Store.use.watchList();
  const strategyStore = Store.use.presetList();
  const updatePreset = Store.use.update_preset_list();
  const insertPreset = Store.use.insert_to_preset_list();

  const params = useParams();

  const gridName = watchList.find((item) => item.code === params.code)?.name;

  const [form, setForm] = useState<IGridTradeStrategyConfig>(createStrategy({ code: params.code as string, strategyName: gridName }));

  const isExist = useMemo(() => strategyStore.find((item) => item.id === form.id), [form, strategyStore]);

  function saveForm() {
    if (isExist) {
      updatePreset(form);
      return;
    }
    insertPreset(form);
  }

  const updateForm = (key: keyof IGridTradeStrategyConfig, value: string | number | boolean) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  return {
    form,
    setForm,
    saveForm,
    updateForm,
  };
}

export default function TransactionPresetSetting(props: IProps) {
  const { className } = props;

  const { form, setForm, saveForm, updateForm } = usePresetSetting();

  const FormRows: FormRowsType[] = [
    {
      label: "计划名称",
      key: "strategyName",
      type: "text",
      render: (row) => <Input value={form.strategyName} onChange={(e) => updateForm("strategyName", e.target.value)} />,
    },
    {
      label: "基准价格",
      key: "basePrice",
      type: "number",
      renderProps: {
        min: 0,
        step: 0.001,
        value: form.basePrice,
        onChange: (value: number) => updateForm("basePrice", value),
      },
    },
    {
      label: "买入数量",
      key: "buyVolume",
      type: "number",
      renderProps: {
        min: 0,
        step: 1,
        value: form.buyVolume,
        onChange: (value: number) => updateForm("buyVolume", value),
      },
    },
    {
      label: "涨幅 (%)",
      key: "priceIncrease",
      type: "number",
      renderProps: {
        min: 0,
        max: 100,
        step: 0.01,
        value: form.priceIncrease,
        onChange: (value: number) => updateForm("priceIncrease", value),
      },
    },
    {
      label: `跌幅`,
      key: "priceDecline",
      type: "number",
      renderProps: {
        min: 0,
        max: 100,
        step: 0.01,
        value: form.priceDecline,
        onChange: (value: number) => updateForm("priceDecline", value),
      },
    },
    {
      label: "压力测试",
      key: "stressTest",
      type: "number",
      renderProps: {
        min: 0,
        max: 100,
        step: 0.01,
        value: form.stressTest,
        onChange: (value: number) => updateForm("stressTest", value),
      },
    },
    {
      label: "逐格加码",
      key: "gridStepIncrement",
      type: "number",
      renderProps: {
        min: 0,
        max: 100,
        step: 0.01,
        value: form.gridStepIncrement,
        onChange: (value: number) => updateForm("gridStepIncrement", value),
      },
    },
    {
      label: "利润留存 (%)",
      key: "profitRetention",
      type: "number",
      renderProps: {
        min: 0,
        max: 100,
        step: 0.01,
        value: form.profitRetention,
        onChange: (value: number) => updateForm("profitRetention", value),
      },
    },
  ];

  const disabled = useMemo(() => {
    const formData = omit(form, ["stressTest", "gridStepIncrement", "profitRetention"]);
    return Object.values(formData).some((value: unknown) => value === 0 || value === null || value === undefined || value === "");
  }, [form]);

  const onPreview = () => {
    console.log(form);

    saveForm();
  };

  return (
    <form onSubmit={(e) => e.preventDefault()} className={cn("w-full ", className)}>
      <div className="grid w-full items-center gap-4 mb-4">
        {FormRows.map((row) => (
          <div key={row.key} className="flex flex-col space-y-1.5">
            <Label htmlFor={row.key}>{row.label}</Label>
            {row?.render ? row?.render(row) : <InputNumber {...row.renderProps!} />}
          </div>
        ))}
      </div>

      <Button className="float-right" onClick={onPreview} disabled={disabled}>
        {disabled ? "请完善参数" : "Preview"}
      </Button>
    </form>
  );
}
