"use server";

import "dotenv/config";

import type { ResponseResultType } from "@etf-visualizer/server";
import db from "#utils/db";
import { revalidatePath } from "next/cache";

type SearchServiceResponseItem = {
  code: string;
  name: string;
  isFavorite?: boolean;
};

type SearchServiceResponse = {
  stock: SearchServiceResponseItem[];
  fund: SearchServiceResponseItem[];
};

export async function searchSecurity(keyword: string) {
  if (!keyword) return null;

  const res = await fetch(`http://localhost:3000/api/search?keyword=${keyword}`);
  const data = (await res.json()) as ResponseResultType<SearchServiceResponse>;

  const favoriteList = await getFavorites();
  const favoriteCodes = favoriteList.map((item) => item.code);

  const helper = (data: { code: string }[]) =>
    data.map((item) => ({
      ...item,
      isFavorite: favoriteCodes.includes(item.code),
    }));

  return {
    fund: helper(data.data.fund),
    stock: helper(data.data.stock),
  };
}

export async function addFavorite(code: string, name: string) {
  const res = await db.insertSecurityFavorite(code, name);

  revalidatePath("/security");
  return res !== null;
}

export async function getFavorites() {
  const res = await db.querySecurityFavorite();

  return res;
}
