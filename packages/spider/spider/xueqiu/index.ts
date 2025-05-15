import dayjs from "dayjs";
import type Fetcher from "../fetcher.ts";
import type {
  V5StockQuoteJson,
  StockKlineParams,
  StockChartKline,
  StockItem,
  SuggestStockJSON,
  ChartKlineJSON,
  ItemItem,
} from "./types.d.ts";
import { AsyncWrapper } from "../fetcher.ts";

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

  @AsyncWrapper("获取股票列表失败")
  async searchByKeyword(keyword: string, count: number = 10) {
    const data = await this.fetcher.XueQiuJSON<SuggestStockJSON>(
      `https://xueqiu.com/query/v1/suggest_stock.json?q=${keyword}&count=${count}`
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

  @AsyncWrapper("获取股票详情失败")
  async fetchStockDetail(code: string) {
    const url = `https://stock.xueqiu.com/v5/stock/quote.json?symbol=${code}&extend=detail`;
    const data = await this.fetcher.XueQiuJSON<V5StockQuoteJson>(url);
    const { error_code, error_description } = data;

    if (error_code !== 0) {
      throw new Error(error_description);
    }

    return data.data;
  }

  @AsyncWrapper("获取股票K线图失败")
  async fetchStockKline({ code, begin, end }: StockKlineParams) {
    const _begin = dayjs(begin).valueOf();
    const _end = dayjs(end).valueOf();

    const url = `https://stock.xueqiu.com/v5/stock/chart/kline.json?symbol=${code}&begin=${_begin}&end=${_end}&period=day&type=before&indicator=kline`;

    const data = await this.fetcher.XueQiuJSON<ChartKlineJSON>(url);

    if (data?.error_code !== 0) {
      throw new Error(JSON.stringify(data));
    }

    const result = data.data.item.map((item: ItemItem) => ({
      code,
      timestamp: dayjs(item[0]).toDate(),
      volume: item[1],
      open: item[2],
      high: item[3],
      low: item[4],
      close: item[5],
    }));
    return result;
  }
}

export default XueQiu;
