import * as echarts from "echarts";

import { isArray } from "lodash-es";
import { calculateCandleMetrics, genCandleHtml } from "./kline-chart-candle";

// TYPES
export type DataType = {
  date: string;
  open: number;
  close: number;
  low: number;
  high: number;
  volume: number;
};

export interface SplitDataResult {
  categoryData: string[];
  values: number[][];
  volumes: [number, number, number][];
}

interface MAResult {
  value: number | "-";
  dayCount: number;
}

export interface KlineRecord {
  date: string;
  value: number;
  quantity: number;
  type: "B" | "S";
}

// CONSTANTS

const upColor = "#00da3c55";
const downColor = "#ec000055";

// FUNCTIONS
export function splitData(rawData: DataType[]): SplitDataResult {
  // 预分配数组大小以提高性能
  const length = rawData.length;
  const categoryData: string[] = new Array(length);
  const values: number[][] = new Array(length);
  const volumes: [number, number, number][] = new Array(length);

  rawData.forEach((data, index) => {
    // 直接使用对象属性，避免解构带来的问题
    categoryData[index] = data.date;
    values[index] = [data.open, data.close, data.low, data.high, data.volume];
    volumes[index] = [index, data.volume, data.open > data.close ? 1 : -1];
  });

  return {
    categoryData,
    values,
    volumes,
  };
}

function calculateMA(dayCount: number, data: SplitDataResult): MAResult[] {
  if (dayCount <= 0) return [];

  const length = data.values.length;
  const result: MAResult[] = new Array(length);

  // 使用滑动窗口优化性能
  let sum = 0;

  for (let i = 0; i < length; i++) {
    if (i < dayCount) {
      result[i] = { value: "-", dayCount };
      sum += data.values[i][1];
      continue;
    }

    // 添加新值并减去窗口外的值
    sum = sum + data.values[i][1] - data.values[i - dayCount][1];
    result[i] = {
      value: Number((sum / dayCount).toFixed(3)),
      dayCount,
    };
  }

  return result;
}

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

export const genKlineOption = ({ data, records = [] }: { data: SplitDataResult; records: KlineRecord[] }): echarts.EChartsOption => {
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
      extraCssText: "width: 200px",
      formatter: function (params: Array<{ name: string; seriesName: string; value: number | string }>) {
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
        });

        const r = calculateCandleMetrics({
          open: Number(result.open),
          close: Number(result.close),
          high: Number(result.high),
          low: Number(result.low),
          maxHeight: 200,
          candleWidth: 20,
        });

        const transactions = records
          .filter((r) => r.date === params[0].name)
          .map((i) => ({
            type: i.type,
            value: i.value,
            quantity: i.quantity,
          }));

        if (r.visualMetrics) {
          const isUp = Number(result.close) > Number(result.open);
          return genCandleHtml(r.visualMetrics, isUp, result as any, transactions);
        }
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
        dataView: { show: true, readOnly: false },
      },
    },

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
          },
          data: [
            {
              name: "highest value",
              type: "max",
              valueDim: "highest",
              symbol: "pin",
              symbolSize: 60,
              itemStyle: {
                color: "#ff0000ae",
              },
            },
            {
              name: "lowest value",
              type: "min",
              valueDim: "lowest",
              symbol: "pin",
              symbolSize: 60,
              itemStyle: {
                color: "#c6f2beae",
              },
            },
            {
              name: "average value on close",
              type: "average",
              valueDim: "close",
              symbol: "pin",
              symbolSize: 60,
              itemStyle: {
                color: "#ba8712ae",
              },
            },
            ...records.map((record) => ({
              name: "Mark",
              coord: [record.date, record.value],
              value: record.type,
              itemStyle: {
                color: record.type === "B" ? "rgb(95, 163, 253)" : "rgb(255, 106, 250)",
              },
            })),
          ],
          tooltip: {
            formatter: function (param: { name: string; data: any }) {
              return param.name + "<br>" + (param.data.coord || "");
            },
          },
        },
        markLine: {
          symbol: ["none", "none"],
          data: [
            [
              {
                name: "from lowest to highest",
                type: "min",
                valueDim: "lowest",
                symbol: "circle",
                symbolSize: 10,
                label: {
                  show: false,
                },
                emphasis: {
                  label: {
                    show: false,
                  },
                },
              },
              {
                type: "max",
                valueDim: "highest",
                symbol: "circle",
                symbolSize: 10,
                label: {
                  show: false,
                },
                emphasis: {
                  label: {
                    show: false,
                  },
                },
              },
            ],
            {
              name: "min line on close",
              type: "min",
              valueDim: "close",
            },
            {
              name: "max line on close",
              type: "max",
              valueDim: "close",
            },
          ],
        },
      },

      MASeries(5, data),
      MASeries(10, data),
      MASeries(20, data),
      MASeries(30, data),
    ],
  };

  return opt as echarts.EChartsOption;
};
