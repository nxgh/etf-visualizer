import { useEffect, useMemo, useRef, useState } from "react";
import mockData from "./data";
import * as echarts from "echarts";

import { splitData, type DataType } from "./helper";
import { cn } from "@shadcn/lib/utils";
import { useSearchParams } from "next/navigation";

import ChartInstance from "./chart-instance";

import { calculateMA, type SplitDataResult } from "./helper";
import { isArray, isString } from "lodash-es";
import { calculateCandleMetrics, genCandleHtml } from "./candle";

const upColor = "#00da3c55";
const downColor = "#ec000055";

const MASeries = (MA: 5 | 10 | 20 | 30, data: SplitDataResult) => ({
  name: `MA${MA}`,
  type: "line",
  data: calculateMA(MA, data),
  smooth: true,
  showSymbol: false,
  lineStyle: {
    opacity: 0.5,
  },
});

interface KlineRecord {
  date: string;
  value: number;
  type: "B" | "S";
}

const genKlineOption = ({ data, records = [] }: { data: SplitDataResult; records: KlineRecord[] }): echarts.EChartsOption => {
  const opt = {
    animation: false,
    legend: {
      bottom: 10,
      left: "center",
      data: ["日K", "MA5", "MA10", "MA20", "MA30"],
    },
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "cross",
      },
      borderWidth: 1,
      borderColor: "#ccc",
      padding: 10,
      textStyle: {
        color: "#000",
      },
      position: (
        point: Array<number>,
        params: Object | Array<Object>,
        dom: HTMLElement,
        rect: {
          x: number;
          y: number;
          width: number;
          height: number;
        },
        size: {
          contentSize: [number, number];
          viewSize: [number, number];
        }
      ): Array<number> | {} => {
        const obj = {
          top: 10,
          left: 0,
          right: 0,
        };
        const position = ["left", "right"][+(point[0] < size.viewSize[0] / 2)] as "left" | "right";
        obj[position] = 30;
        return obj;
      },
      extraCssText: "width: 170px",
      formatter: function (params: Array<{ name: string; seriesName: string; value: number | string }>) {
        // let res = params[0].name + "<br/>";

        const result: Record<string, unknown> = {
          date: params[0].name,
          open: "",
          close: "",
          high: "",
          low: "",
          volume: "",
          ma5: "",
          ma10: "",
          ma20: "",
          ma30: "",
        };

        params.forEach((item) => {
          if (item.seriesName === "日K") {
            if (isArray(item?.value)) {
              result.open = item.value[1]; // 开盘价
              result.close = item.value[2]; // 收盘价
              result.low = item.value[3]; // 最低价
              result.high = item.value[4]; // 最高价
              result.volume = item.value[5]; // 交易量
              return;
            }
          }
          result[item.seriesName.toLowerCase()] = item.value;
          // res += `${item.seriesName}: ${item.value}<br/>`;
        });

        const r = calculateCandleMetrics({
          open: Number(result.open),
          close: Number(result.close),
          high: Number(result.high),
          low: Number(result.low),
          maxHeight: 200,
          candleWidth: 20,
        });

        if (r.visualMetrics) {
          const isUp = Number(result.close) > Number(result.open);
          return genCandleHtml(r.visualMetrics, isUp, result as any);
        }

        // // records.forEach((item) => {
        // //   res += `${item.date}: ${item.value} ${item.type}<br/>`;
        // // });

        // const existHandle = records.filter((item) => item.date === params[0].name);

        // existHandle.forEach((item) => {
        //   res += `${item.date}: ${item.value} ${item.type}<br/>`;
        // });
        console.log(r);
        return JSON.stringify(result);
      },
    },
    axisPointer: {
      link: [
        {
          xAxisIndex: "all",
        },
      ],
      label: {
        backgroundColor: "#777",
      },
    },

    toolbox: {
      feature: {
        // dataZoom: {
        //   yAxisIndex: true,
        // },
        // brush: {
        //   type: ["lineX" as const, "clear" as const],
        // },
        dataView: { show: true, readOnly: false },
      },
    },
    // brush: {
    //   xAxisIndex: "all",
    //   brushLink: "all",
    //   outOfBrush: {
    //     colorAlpha: 0.1,
    //   },
    // },
    // visualMap: {
    //   show: false,
    //   seriesIndex: 5,
    //   dimension: 2,
    //   pieces: [
    //     {
    //       value: 1,
    //       color: downColor,
    //     },
    //     {
    //       value: -1,
    //       color: upColor,
    //     },
    //   ],
    // },
    grid: [
      {
        left: "5%",
        right: "5%",
        height: "65%",
      },
      {},
    ],
    xAxis: [
      {
        type: "category" as const,
        data: data.categoryData,
        boundaryGap: false,
        axisLine: { onZero: false },
        splitLine: { show: false },
        min: "dataMin",
        max: "dataMax",
        axisPointer: {
          z: 100,
        },
      },
      {
        type: "category" as const,
        gridIndex: 1,
        data: data.categoryData,
        boundaryGap: false,
        axisLine: { onZero: false },
        axisTick: { show: false },
        splitLine: { show: false },
        axisLabel: { show: false },
        min: "dataMin",
        max: "dataMax",
      },
    ],
    yAxis: [
      {
        scale: true,
        splitArea: {
          show: true,
        },
      },
      {
        scale: true,
        gridIndex: 1,
        splitNumber: 2,
        axisLabel: { show: false },
        axisLine: { show: false },
        axisTick: { show: false },
        splitLine: { show: false },
      },
    ],
    dataZoom: [
      {
        type: "inside",
        start: 80,
        end: 100,
      },
      {
        show: true,
        type: "slider",
        bottom: "10%",
        start: 0,
        end: 100,
      },
    ],
    series: [
      {
        name: "日K",
        type: "candlestick",
        data: data.values,
        itemStyle: {
          color: upColor,
          color0: downColor,
          borderColor: undefined,
          borderColor0: undefined,
        },
        markPoint: {
          symbol: "rect",
          symbolSize: 20,
          itemStyle: {
            color: "transparent",
          },
          label: {
            color: "#000",
            // formatter: function (param: { value: string | number }) {
            //   return typeof param.value === "number" ? Math.round(param.value).toString() : param.value;
            // },
          },
          data: [
            // {
            //   name: "highest value",
            //   type: "max",
            //   valueDim: "highest",
            // },
            // {
            //   name: "lowest value",
            //   type: "min",
            //   valueDim: "lowest",
            // },
            // {
            //   name: "average value on close",
            //   type: "average",
            //   valueDim: "close",
            //   itemStyle: {
            //     color: "yellow",
            //   },
            // },
            ...records.map((record) => ({
              name: "Mark",
              coord: [record.date, record.value],
              value: record.type,
              itemStyle: {
                color: record.type === "B" ? "rgb(95, 163, 253)" : "rgb(255, 106, 250)",
              },
            })),
            // {
            //   name: "Mark",
            //   coord: ["2023-05-10", 0.496],
            //   value: "0.496",
            //   itemStyle: {
            //     color: "rgb(95, 163, 253)",
            //   },
            //   label: {
            //     color: "#000",
            //   },
            // },
            // {
            //   name: "Mark",
            //   coord: ["2004-06-15", 10337],
            //   value: "S",
            //   itemStyle: {
            //     color: "rgb(255, 106, 250)",
            //   },
            // },
          ],
          tooltip: {
            formatter: function (param: { name: string; data: any }) {
              return param.name + "<br>" + (param.data.coord || "");
            },
          },
        },
        markLine: {
          symbol: ["none", "none"],
          // data: [
          //   [
          //     {
          //       name: "from lowest to highest",
          //       type: "min",
          //       valueDim: "lowest",
          //       symbol: "circle",
          //       symbolSize: 10,
          //       label: {
          //         show: false,
          //       },
          //       emphasis: {
          //         label: {
          //           show: false,
          //         },
          //       },
          //     },
          //     {
          //       type: "max",
          //       valueDim: "highest",
          //       symbol: "circle",
          //       symbolSize: 10,
          //       label: {
          //         show: false,
          //       },
          //       emphasis: {
          //         label: {
          //           show: false,
          //         },
          //       },
          //     },
          //   ],
          //   {
          //     name: "min line on close",
          //     type: "min",
          //     valueDim: "close",
          //   },
          //   {
          //     name: "max line on close",
          //     type: "max",
          //     valueDim: "close",
          //   },
          // ],
        },
      },

      MASeries(5, data),
      MASeries(10, data),
      MASeries(20, data),
      MASeries(30, data),
      // {
      //   name: "Volume",
      //   type: "bar",
      //   xAxisIndex: 1,
      //   yAxisIndex: 1,
      //   data: data.volumes,
      // },
    ],
  };
  return opt as echarts.EChartsOption;
};

export default function Chart({ className }: { className: string }) {
  const code = useSearchParams().get("c") || "";

  const data = splitData(mockData);

  const records: KlineRecord[] = [
    { date: "2023-05-10", value: 0.496, type: "B" },
    { date: "2023-05-29", value: 0.491, type: "B" },
    { date: "2023-06-13", value: 0.551, type: "S" },
  ];

  const option = useMemo(
    () =>
      genKlineOption({
        data,
        records,
      }),
    [data, records]
  );

  return <ChartInstance className={className} option={option} />;
}
