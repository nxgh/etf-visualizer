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

function splitData(rawData: DataType[]): SplitDataResult {
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

interface MAResult {
  value: number | "-";
  dayCount: number;
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

export { splitData, calculateMA };

// export function splitData2(rawData: DataType[]) {
//   let categoryData = [];
//   let values = [];
//   let volumes = [];
//   for (let i = 0; i < rawData.length; i++) {
//     categoryData.push(rawData[i].splice(0, 1)[0]);
//     values.push(rawData[i]);
//     volumes.push([i, rawData[i][4], rawData[i][0] > rawData[i][1] ? 1 : -1]);
//   }
//   return {
//     categoryData: categoryData,
//     values: values,
//     volumes: volumes,
//   };
// }
// export function calculateMA2(dayCount: number, data: any) {
//   var result = [];
//   for (var i = 0, len = data.values.length; i < len; i++) {
//     if (i < dayCount) {
//       result.push("-");
//       continue;
//     }
//     var sum = 0;
//     for (var j = 0; j < dayCount; j++) {
//       sum += data.values[i - j][1];
//     }
//     result.push(+(sum / dayCount).toFixed(3));
//   }
//   return result;
// }
