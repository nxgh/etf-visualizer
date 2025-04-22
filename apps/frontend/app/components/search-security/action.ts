"use server";

import "dotenv/config";

import type { SearchServiceResponse, ResponseResultType } from "@etf-visualizer/server";
import db from "#utils/db";

export async function searchSecurity(keyword: string) {
  if (!keyword) return null;

  const res = await fetch(`http://localhost:3000/api/search?keyword=${keyword}`);
  const data = (await res.json()) as ResponseResultType<SearchServiceResponse>;

  return data.data;
}

export async function addFavorite(code: string, name: string) {
  // db.
  //

  const res = await db.insertSecurityFavorite(code, name);
  console.log(res);
  // return res;
  return true;
  // return data.data;
}
