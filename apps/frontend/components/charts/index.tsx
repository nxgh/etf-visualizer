import { useEffect, useMemo, useRef, useState } from "react";
import mockData, { type DataType } from "./data";
import * as echarts from "echarts";
import option from "./option";
import { splitData } from "./helper";
import { cn } from "@shadcn/lib/utils";
import { useSearchParams } from "next/navigation";

export default function Chart({ className }: { className: string }) {
  const chartRef = useRef<HTMLDivElement>(null);
  const [echartsInstance, setEchartInstance] = useState<echarts.ECharts | null>(null);

  // 使用 useMemo 缓存数据处理结果
  const data = useMemo(() => splitData(mockData), []);

  const code = useSearchParams().get("code") || "";

  // 初始化图表
  useEffect(() => {
    if (!chartRef.current) return;

    // 创建实例
    const instance = echarts.init(chartRef.current);
    setEchartInstance(instance);

    // 设置初始配置
    instance.setOption(option({ data, title: code }));

    // 添加响应式调整
    const handleResize = () => {
      instance.resize();
    };
    window.addEventListener("resize", handleResize);

    // 清理函数
    return () => {
      window.removeEventListener("resize", handleResize);
      instance.dispose();
    };
  }, []); // 仅在组件挂载时执行一次

  // 数据更新时更新图表
  useEffect(() => {
    if (!echartsInstance) return;
    echartsInstance.setOption(option({ data, title: code }));
  }, [data, echartsInstance, option, code]);

  return <div ref={chartRef} className={cn("w-[900px] h-[600px]", className)} />;
}
