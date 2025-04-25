"use server";
import { xueQiu, danJuan } from "#utils/fetcher";

export type SearchResponse = { name: string; code: string; type: "stock" | "fund" }[];

export async function searchSecurityAction(keyword: string) {
  if (!keyword) return null;

  const stockList = await xueQiu.search_by_keyword(keyword);
  const fundList = await danJuan.search_by_keyword(keyword);

  return [...stockList?.map((item) => ({ ...item, type: "stock" }))!, ...fundList?.map((item) => ({ ...item, type: "fund" }))!];
}
