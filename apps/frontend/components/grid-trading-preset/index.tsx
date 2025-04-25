"use client";

import { cn } from "@shadcn/lib/utils";

import GridTradingPresetList from "./list";
import { FileChartColumnIncreasing, FileChartLine } from "lucide-react";
import { useState } from "react";
import EditItem from "./edit-item";
const mockData = [
  {
    name: "恒科固定10%",
    code: "SH513180",
    type: "fixed",
    // 基准价格
    basePrice: 100,
    // 涨幅
    rise: 10,
    // 跌幅
    fall: 10,
  },
  {
    name: "恒科档位",
    code: "SH513180",
    type: "level",
    // 基准价格
    basePrice: 100,
    // 档位
    level: 10,
    // 步长
    step: 0.5,
    priceList: [
      {
        level: 1.0,
        //买入价
        buyPrice: [1.225, 1.227],
        //卖出价
        sellPrice: [1.33, 1.332],
      },
      { level: 0.95, buyPrice: [1.225, 1.227], sellPrice: [1.33, 1.332] },
      { level: 0.9, buyPrice: [1.225, 1.227], sellPrice: [1.33, 1.332] },
      { level: 0.85, buyPrice: [1.225, 1.227], sellPrice: [1.33, 1.332] },
      { level: 0.8, buyPrice: [1.225, 1.227], sellPrice: [1.33, 1.332] },
      { level: 0.75, buyPrice: [1.225, 1.227], sellPrice: [1.33, 1.332] },
      { level: 0.7, buyPrice: [1.225, 1.227], sellPrice: [1.33, 1.332] },
      { level: 0.65, buyPrice: [1.225, 1.227], sellPrice: [1.33, 1.332] },
      { level: 0.6, buyPrice: [1.225, 1.227], sellPrice: [1.33, 1.332] },
      { level: 0.55, buyPrice: [1.225, 1.227], sellPrice: [1.33, 1.332] },
      { level: 0.5, buyPrice: [1.225, 1.227], sellPrice: [1.33, 1.332] },
    ],
  },
];

export default function GridTradingPreset({ className }: { className?: string }) {
  const [presets, setPresets] = useState(mockData);

  const insertPreset = () => {};

  return (
    <div className={cn("w-full flex  gap-2", className)}>
      网格预设
      <GridTradingPresetList list={presets} className="w-[300px] !w-min-[300px]  h-[400px]" />
      <div>
        <div className="flex gap-2">
          <FileChartColumnIncreasing onClick={() => insertPreset()} />
          <EditItem />
        </div>
      </div>
    </div>
  );
}

// 1. 选择产品
// 2. 设置 基本信息
//      - 基准价格
//      - 网格类型：固定涨跌、档位设置
// 3. 设置 网格交易信息
// 4. 设置 交易记录
