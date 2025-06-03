export interface StockItem {
  name: string;
  code: string;
}
export type FundItem = StockItem;

export type * from "./types/stock-quote-json.js";
export type * from "./types/suggest-stock-json.js";
export type * from "./types/chart-kline.js";
export type * from './types/batch-quote.js'