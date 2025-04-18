import dayjs from "dayjs";
import Fetcher from "#/fetcher.ts";
import type { V5StockQuoteJson, StockKlineParams, StockChartKline } from "#types";

class XueQiu {
  private fetcher: Fetcher;

  constructor(fetcher: Fetcher) {
    this.fetcher = fetcher;
  }

  async search_by_keyword(keyword: string) {
    return this.fetcher.asyncWrapper<Response[]>(async () => {
      const resp = await this.fetcher.xueqiu(`https://xueqiu.com/query/v1/suggest_stock.json?q=${keyword}&count=5`);
      const data = await resp.json();
      if (data.code !== 200 && !data.success) {
        throw new Error(data);
      }
      return data.data.map((i: { code: string; query: string }) => ({
        code: i.code,
        name: i.query,
      }));
    }, "Get StockList");
  }

  async fetch_stock_detail(code: string) {
    return this.fetcher.asyncWrapper<V5StockQuoteJson["data"]>(async () => {
      const url = `https://stock.xueqiu.com/v5/stock/quote.json?symbol=${code}&extend=detail`;
      const res = await this.fetcher.xueqiu(url);

      const data = (await res.json()) as V5StockQuoteJson;
      const { error_code, error_description } = data;

      if (error_code !== 0) {
        throw new Error(error_description);
      }

      return data.data;
    }, "Get StockDetail");
  }

  async fetch_stock_kline({ code, begin, end }: StockKlineParams) {
    const _begin = dayjs(begin).valueOf();
    const _end = dayjs(end).valueOf();

    const url = `https://stock.xueqiu.com/v5/stock/chart/kline.json?symbol=${code}&begin=${_begin}&end=${_end}&period=day&type=before&indicator=kline`;

    return this.fetcher.asyncWrapper<StockChartKline[]>(async () => {
      const resp = await this.fetcher.xueqiu(url);
      const data = await resp.json();

      if (data?.error_code !== 0) {
        throw new Error(data);
      }

      const result = data.data.item.map((item: number[]) => ({
        code,
        timestamp: dayjs(item[0]).toDate(),
        volume: item[1],
        open: item[2],
        high: item[3],
        low: item[4],
        close: item[5],
      }));
      return result;
    }, "Get StockKline");
  }
}

export default XueQiu;
