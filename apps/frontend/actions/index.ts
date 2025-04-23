"use server";
import { xueQiu, danJuan } from "#utils/fetcher";
import type { StockItem, FundItem } from "@etf-visualizer/spider";

export type SearchResponse = (StockItem & { type: "stock" | "fund" })[];

export async function searchSecurityAction(keyword: string) {
  if (!keyword) return null;

  const stockList = await xueQiu.search_by_keyword(keyword);
  const fundList = await danJuan.search_by_keyword(keyword);

  return [...stockList?.map((item) => ({ ...item, type: "stock" }))!, ...fundList?.map((item) => ({ ...item, type: "fund" }))!];
}
