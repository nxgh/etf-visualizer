import { useEffect, useMemo, useRef, useState } from "react";
import mockData, { type DataType } from "./data";
import * as echarts from "echarts";
import option from "./option";
import { splitData } from "./helper";

export default function Chart() {
  const chartRef = useRef<HTMLDivElement>(null);
  const [echartsInstance, setEchartInstance] = useState<echarts.ECharts | null>(null);

  // 使用 useMemo 缓存数据处理结果
  const data = useMemo(() => splitData(mockData), []);

  // 初始化图表
  useEffect(() => {
    if (!chartRef.current) return;

    // 创建实例
    const instance = echarts.init(chartRef.current);
    setEchartInstance(instance);

    // 设置初始配置
    instance.setOption(option(data));

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
    echartsInstance.setOption(option(data));
  }, [data, echartsInstance, option]);

  return <div ref={chartRef} className="w-[900px] h-[600px]" />;
}
