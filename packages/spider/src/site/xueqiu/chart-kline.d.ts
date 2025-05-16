export type StockChartKline = {
  code: string;
  timestamp: Date;
  volume: number;
  open: number;
  high: number;
  low: number;
  close: number;
};

export type StockKlineParams = {
  code: string;
  begin: ConfigType;
  end: ConfigType;
};

type timestamp = number;
type volume = number;
type open = number;
type high = number;
type low = number;
type close = number;
type chg = number;
type percent = number;
type turnoverrate = number;
type amount = number;
type volume_post = string;
type amount_post = string;
type pe = number;
type pb = number;
type ps = number;
type pcf = string | number | null;
type market_capital = string | number | null;
type balance = string | number | null;
type hold_volume_cn = string | number | null;
type hold_ratio_cn = string | number | null;
type net_volume_cn = string | number | null;
type hold_volume_hk = string | number | null;
type hold_ratio_hk = string | number | null;
type net_volume_h = string | number | null;

export interface ItemItem {
  0: timestamp;
  1: volume;
  2: open;
  3: high;
  4: low;
  5: close;
  6: chg;
  7: percent;
  8: turnoverrate;
  9: amount;
  10: volume_post;
  11: amount_post;
  12: pe;
  13: pb;
  14: ps;
  15: pcf;
  16: market_capital;
  17: balance;
  18: hold_volume_cn;
  19: hold_ratio_cn;
  20: net_volume_cn;
  21: hold_volume_hk;
  22: hold_ratio_hk;
  23: net_volume_h;
}

interface Data {
  symbol: string;
  column: string[];
  item: ItemItem[];
}

export interface ChartKlineJSON {
  data: Data;
  error_code: number;
  error_description: string;
}
