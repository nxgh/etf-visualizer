import { calculateMA, type SplitDataResult } from "./helper";

const upColor = "#00da3c";
const downColor = "#ec0000";

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

const option = (data) => ({
  animation: false,
  legend: {
    bottom: 10,
    left: "center",
    data: ["Dow-Jones index", "MA5", "MA10", "MA20", "MA30"],
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
    // position: function (pos, params, el, elRect, size) {
    //   const obj = {
    //     top: 10,
    //   };
    //   obj[["left", "right"][+(pos[0] < size.viewSize[0] / 2)]] = 30;
    //   return obj;
    // },
    extraCssText: "width: 170px",
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
      dataZoom: {
        yAxisIndex: false,
      },
      brush: {
        type: ["lineX", "clear"],
      },
    },
  },
  brush: {
    xAxisIndex: "all",
    brushLink: "all",
    outOfBrush: {
      colorAlpha: 0.1,
    },
  },
  visualMap: {
    show: false,
    seriesIndex: 5,
    dimension: 2,
    pieces: [
      {
        value: 1,
        color: downColor,
      },
      {
        value: -1,
        color: upColor,
      },
    ],
  },
  grid: [
    {
      left: "10%",
      right: "8%",
      height: "50%",
    },
    {
      left: "10%",
      right: "8%",
      top: "63%",
      height: "16%",
    },
  ],
  xAxis: [
    {
      type: "category",
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
      type: "category",
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
      start: 50,
      end: 100,
    },
    {
      show: true,
      type: "slider",
      top: "90%",
      start: 50,
      end: 100,
    },
  ],
  series: [
    {
      name: "Dow-Jones index",
      type: "candlestick",
      data: data.values,
      itemStyle: {
        color: upColor,
        color0: downColor,
        borderColor: undefined,
        borderColor0: undefined,
      },
      markPoint: {
        // symbol: "circle",
        // // symbolSize: 20,
        // label: {
        //   formatter: function (param: { value: string | number }) {
        //     return typeof param.value === "number" ? Math.round(param.value).toString() : param.value;
        //   },
        // },
        data: [
          {
            name: "Mark",
            coord: ["2004-06-17", 10381],
            value: "B",
            itemStyle: {
              color: "rgb(95, 163, 253)",
            },
          },
          {
            name: "Mark",
            coord: ["2004-06-15", 10337],
            value: "S",
            itemStyle: {
              color: "rgb(255, 106, 250)",
            },
          },
          {
            name: "highest value",
            type: "max",
            valueDim: "highest",
          },
          {
            name: "lowest value",
            type: "min",
            valueDim: "lowest",
          },
          {
            name: "average value on close",
            type: "average",
            valueDim: "close",
          },
        ],
        tooltip: {
          formatter: function (param) {
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
    // {
    //   name: "Volume",
    //   type: "bar",
    //   xAxisIndex: 1,
    //   yAxisIndex: 1,
    //   data: data.volumes,
    // },
    // {
    //   name: "T",
    //   type: "line",
    //   data: calculateMA(30, data),
    //   smooth: true,
    //   lineStyle: {
    //     opacity: 0.5,
    //   },
    // },
  ],
});

export default option;
