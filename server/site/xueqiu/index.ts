import dayjs from "dayjs";
import { fetchXueQiu } from "../../utils/fetcher";
import type { StockQuoteJson, StockKlineParams, SuggestStockJSON, ChartKlineJSON, BatchQuoteResponse } from "./types.d.ts";

export async function searchByKeyword(keyword: string, count = 10) {
  const data = await fetchXueQiu<SuggestStockJSON>(`https://xueqiu.com/query/v1/suggest_stock.json?q=${keyword}&count=${count}`);

  if (!data.success) {
    throw new Error(JSON.stringify(data));
  }
  return data.data.map((i) => ({
    code: i.code,
    name: i.query,
    type: i.stock_type,
  }));
}

export async function fetchStockDetail(symbol: string) {
  const url = `https://stock.xueqiu.com/v5/stock/quote.json?symbol=${symbol}&extend=detail`;
  const data = await fetchXueQiu<StockQuoteJson>(url);

  const { error_code, error_description } = data;

  if (error_code !== 0) {
    throw new Error(JSON.stringify(data));
  }

  return data.data;
}

export async function fetchStockKline({ symbol, begin, end }: StockKlineParams) {
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

  const data = await fetchXueQiu<ChartKlineJSON>(url);

  if (data?.error_code !== 0) {
    throw new Error(JSON.stringify(data));
  }

  return data;
}

export async function batchQuote(symbols: string) {
  const url = `https://stock.xueqiu.com/v5/stock/batch/quote.json?symbol=${symbols}`;
  const data = await fetchXueQiu<BatchQuoteResponse>(url);

  if (data?.error_code !== 0) {
    throw new Error(JSON.stringify(data));
  }

  return data;
}
