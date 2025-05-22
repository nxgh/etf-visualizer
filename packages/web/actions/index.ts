"use server";

import { TrpcClient } from "#utils/trpc-client";

export type SearchResponse = { name: string; code: string; type: "stock" | "fund" }[];

export async function searchSecurityAction(keyword: string) {
  if (!keyword) return null;

  const res = await TrpcClient.spider.search.query(keyword);

  return res;
}

export async function getSecurityDetailAction(symbol: string) {
  console.log("getSecurityDetailAction", symbol);
  const res = await TrpcClient.spider.detail.query({ symbol });
  return res;
}

export async function getSyncDataAction() {
  const res = await TrpcClient.server.getSyncData.query();
  return res;
}

export async function syncDataAction(data: unknown) {
  if (!data) return;
  const res = await TrpcClient.server.sync.mutate({ data });
  return res;
}
