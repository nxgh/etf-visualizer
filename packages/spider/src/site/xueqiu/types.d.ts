import type { ConfigType } from "dayjs";

export interface StockItem {
  name: string;
  code: string;
}
export type FundItem = StockItem;

export type * from "./stock-quote-json.d.ts";
export type * from "./suggest-stock-json.d.ts";
export type * from "./chart-kline.d.ts";
