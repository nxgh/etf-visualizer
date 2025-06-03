"use server";

import { TrpcClient } from "#utils/trpc-client";

export type SearchResponse = { name: string; code: string; type: "stock" | "fund" }[];

export async function searchSecurityAction(keyword: string) {
  if (!keyword) return null;

  console.log("searchSecurityAction", keyword);
  const res = await TrpcClient.search.query(keyword);

  return res;
}

export async function getSecurityDetailAction(symbol: string) {
  console.log("getSecurityDetailAction", symbol);
  const res = await TrpcClient.detail.query({ symbol });
  return res;
}

export async function getSyncDataAction() {
  // const res = await TrpcClient.server.getSyncData.query();
  return null;
}

export async function syncDataAction(data: unknown) {
  if (!data) return;
  // const res = await TrpcClient.server.sync.mutate({ data });
  return null;
}

export async function quoteAction(symbols: string[]) {
  console.log(symbols.join(","));
  const res = await TrpcClient.batchQuote.query({ symbols: symbols.join(",") });

  console.log(res);

  if (res?.data) {
    const result = res.data.items.map((item) => item.quote);
    return result;
  }
  return [];
}
