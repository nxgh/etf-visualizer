"use client";
import { useEffect, useRef } from "react";
import * as echarts from "echarts";

const Charts = (data: any) => {
  "use client";

  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    var myChart = echarts.init(ref.current);
    // 绘制图表
    myChart.setOption({
      tooltip: {},
      xAxis: {
        data: ["衬衫", "羊毛衫", "雪纺衫", "裤子", "高跟鞋", "袜子"],
      },
      yAxis: {},
      series: [
        {
          name: "销量",
          type: "bar",
          data: [5, 20, 36, 10, 10, 20],
        },
      ],
    });
  }, [data]);

  return <div className="w-96 h-80" ref={ref}></div>;
};

export default Charts;
