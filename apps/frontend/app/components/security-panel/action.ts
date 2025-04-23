"use server";

import db from "#utils/db";
import { revalidatePath } from "next/cache";

import type { ResponseResultType } from "@etf-visualizer/server";

type SearchServiceResponseItem = {
  code: string;
  name: string;
  isFavorite?: boolean;
};

type SearchServiceResponse = {
  stock: SearchServiceResponseItem[];
  fund: SearchServiceResponseItem[];
};

export async function removeFavorite(code: string) {
  const res = await db.updateSecurityFavorite(code, false);
}

export async function getFavoriteListAction() {
  const res = db.querySecurityFavorite();
  return res;
}

export async function searchSecurityAction(keyword: string) {
  if (!keyword) return null;

  const res = await fetch(`http://localhost:3000/api/search?keyword=${keyword}`);
  const data = (await res.json()) as ResponseResultType<SearchServiceResponse>;

  return data.data;
}

export async function addFavoriteAction(code: string, name: string) {
  const res = await db.insertSecurityFavorite(code, name);

  return res !== null;
}

export async function getFavoritesAction() {
  const res = await db.querySecurityFavorite();

  return res;
}
