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

    // 空值处理
    if (!val) {
      onChange(min);
      return;
    }

    // 数字验证
    try {
      const decimal = new Decimal(val);
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
      // 无效的数字格式
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

  return (
    <div className={`flex items-center relative w-full ${className} group`}>
      <Input
        type="number"
        value={value}
        onChange={_onChange}
        min={min}
        max={max}
        step={step}
        className="w-full [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
      />
      <div className={cn("absolute right-1 flex-col gap-0.5 hidden group-hover:flex")}>
        <Button variant="ghost" size="icon" className="h-4 w-4 p-0 hover:bg-gray-100" onClick={() => handleStep("up")}>
          <ChevronUp className="h-3 w-3" />
        </Button>
        <Button variant="ghost" size="icon" className="h-4 w-4 p-0 hover:bg-gray-100" onClick={() => handleStep("down")}>
          <ChevronDown className="h-3 w-3" />
        </Button>
      </div>
    </div>
  );
}
