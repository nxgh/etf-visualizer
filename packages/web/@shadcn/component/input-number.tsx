import { Input } from "@shadcn/ui/input";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@shadcn/ui/button";
import Decimal from "decimal.js";
import { cn } from "@shadcn/lib/utils";

interface InputNumberProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  className?: string;
}

export default function InputNumber({ value, onChange, min = -Infinity, max = Infinity, step = 1, className = "" }: InputNumberProps) {
  function _onChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value;

    // 空值或单个符号处理
    if (!val || val === "-" || val === "+") {
      return;
    }

    // 数字验证
    try {
      // 处理科学计数法和数学符号
      const normalizedVal = val.replace(/[eE]\+/, "e").replace(/[eE]\-/, "e-");
      const decimal = new Decimal(normalizedVal);
      const num = decimal.toNumber();

      // 范围验证
      if (num < min) {
        onChange(min);
        return;
      }
      if (num > max) {
        onChange(max);
        return;
      }

      onChange(num);
    } catch (error) {
      // 无效的数字格式，保持原值不变
      return;
    }
  }

  function handleStep(type: "up" | "down") {
    try {
      const current = new Decimal(value);
      const stepDecimal = new Decimal(step);
      const newValue = type === "up" ? current.plus(stepDecimal) : current.minus(stepDecimal);

      const num = newValue.toNumber();

      if (num < min) {
        onChange(min);
        return;
      }
      if (num > max) {
        onChange(max);
        return;
      }

      onChange(num);
    } catch (error) {
      // 处理计算错误
      return;
    }
  }

  function formatValue(val: number) {
    try {
      const decimal = new Decimal(val);
      // 如果是整数，不显示小数点
      if (decimal.isInteger()) {
        return decimal.toString();
      }
      // 否则保留合适的小数位数
      return decimal.toFixed();
    } catch {
      return val.toString();
    }
  }

  return (
    <div className={`flex items-center relative w-full ${className} group`}>
      <Input
        type="Number"
        value={formatValue(value)}
        onChange={_onChange}
        min={min}
        max={max}
        step={step}
        className="w-full [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
      />
      <div className={cn("absolute right-1 flex-col gap-0.5 hidden group-hover:flex")}>
        <span
          className="h-4 w-4 bg-gray-100 hover:border hover:border-gray-200 flex items-center justify-center"
          onClick={() => handleStep("up")}
        >
          <ChevronUp className="size-4" />
        </span>
        <span
          className="h-4 w-4 bg-gray-100 hover:border hover:border-gray-200 flex items-center justify-center"
          onClick={() => handleStep("down")}
        >
          <ChevronDown className="size-4" />
        </span>
      </div>
    </div>
  );
}
