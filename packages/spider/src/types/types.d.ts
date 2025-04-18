import type { ConfigType } from "dayjs";

export type * from "./stock-quote-json.d.ts";

export type StockKlineParams = {
  code: string;
  begin: ConfigType;
  end: ConfigType;
};

export type StockChartKline = {
  code: string;
  timestamp: Date;
  volume: number;
  open: number;
  high: number;
  low: number;
  close: number;
};
