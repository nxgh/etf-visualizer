import { useEffect, useRef, useState } from "react";
import * as echarts from "echarts";
import { cn } from "@shadcn/lib/utils";

export default function ChartInstance({ className, option }: { className: string; option: echarts.EChartsOption }) {
  const chartRef = useRef<HTMLDivElement>(null);
  const [echartsInstance, setEchartsInstance] = useState<echarts.ECharts | null>(null);

  // 初始化图表
  useEffect(() => {
    if (!chartRef.current) return;

    // 创建实例
    const instance = echarts.init(chartRef.current);
    setEchartsInstance(instance);

    // 设置初始配置
    instance.setOption(option);

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
  }, []);

  useEffect(() => {
    if (!echartsInstance) return;
    console.log("option", option);
    echartsInstance.setOption(option);
  }, [echartsInstance, option]);

  return <div ref={chartRef} className={cn("w-[900px] h-[600px]", className)} />;
}
