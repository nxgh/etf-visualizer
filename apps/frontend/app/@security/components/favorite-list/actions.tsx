"use server";

import db from "#utils/db";
import { revalidatePath } from "next/cache";

export async function RemoveFavoriteAction({ code }: { code: string }) {
  const res = await db.updateSecurityFavorite(code, false);

  revalidatePath("/security");
}

export async function getFavoriteListAction() {
  const res = db.querySecurityFavorite();
  return res;
}
