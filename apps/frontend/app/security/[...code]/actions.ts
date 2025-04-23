"use server";

import db from "#utils/db";
import { Transaction } from "@etf-visualizer/database";
import { revalidateTag } from "next/cache";
export async function queryTransactions(code: string) {
  const transactions = await db.queryTransaction(code);
  return transactions;
}

export async function insertTransactions(transactions: Transaction[]) {
  const result = await db.insertOrUpdateTransaction(transactions);

  revalidateTag("wtf");
  return true;
}
