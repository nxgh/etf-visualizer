import dayjs from "dayjs";
import { AsyncCatch, type Fetcher } from "#fetcher";
import type {
  V5StockQuoteJson,
  StockKlineParams,
  StockChartKline,
  StockItem,
  SuggestStockJSON,
  ChartKlineJSON,
  ItemItem,
} from "./types.d.ts";

const STOCK_TYPE = {
  11: "A股",
  12: "指数",
  13: "ETF基金",
  23: "指数基金/联接基金",
  30: "港股",
  6: "美股/ADR",
  31: "港股指数",
  35: "行业板块",
  81: "概念板块",
  26: "指数",
};

class XueQiu {
  fetcher: Fetcher;

  constructor(fetcher: Fetcher) {
    this.fetcher = fetcher;
  }

  @AsyncCatch("获取股票列表失败")
  async searchByKeyword(keyword: string, count = 10) {
    const data = await this.fetcher.XueQiuJSON<SuggestStockJSON>(
      `https://xueqiu.com/query/v1/suggest_stock.json?q=${keyword}&count=${count}`,
    );

    if (!data.success) {
      throw new Error(data.message);
    }
    return data.data.map((i) => ({
      code: i.code,
      name: i.query,
      type: i.stock_type,
    }));
  }

  @AsyncCatch("获取股票详情失败")
  async fetchStockDetail(symbol: string) {
    const url = `https://stock.xueqiu.com/v5/stock/quote.json?symbol=${symbol}&extend=detail`;
    const data = await this.fetcher.XueQiuJSON<V5StockQuoteJson>(url);

    const { error_code, error_description } = data;

    if (error_code !== 0) {
      throw new Error(error_description);
    }

    return data.data;
  }

  @AsyncCatch("获取股票K线图失败")
  async fetchStockKline({ symbol, begin, end }: StockKlineParams) {
    const _begin = dayjs(begin).valueOf().toString();
    const _end = dayjs(end).valueOf().toString();

    const searchParams = new URLSearchParams({
      symbol: symbol,
      begin: _begin,
      end: _end,
      period: "day",
      type: "before",
      indicator: "kline",
    });

    const url = `https://stock.xueqiu.com/v5/stock/chart/kline.json?${searchParams.toString()}`;

    const data = await this.fetcher.XueQiuJSON<ChartKlineJSON>(url);

    if (data?.error_code !== 0) {
      throw new Error(JSON.stringify(data));
    }

    return data;
  }
}

export default XueQiu;
