export interface QueryStockDetailResult {
  code: string;
  name: string;
  issue_date: string;
}

export interface QueryStockHistoryParams {
  code: string;
  timestamp: string;
  volume: number;
  open: number;
  high: number;
  low: number;
  close: number;
}

export interface QueryStockHistoryResult extends QueryStockHistoryParams {
  create_at: Date;
  update_at: Date;
}

export type Volume = number;
export type Open = number;
export type High = number;
export type Low = number;
export type Close = number;
export type Code = string;
export type Timestamp = string;


export interface Transaction {
  id?: number;
  code: string;
  timestamp: string;
  type: string;
  price: number;
  volume: number;
  profit?: number;
  profit_rate?: number;
}
