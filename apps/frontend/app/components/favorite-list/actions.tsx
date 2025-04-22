"use server";

export async function RemoveFavoriteAction({ code }: { code: string }) {
  await fetch(`http://localhost:3000/api/stock/favorite?code=${code}`, {
    method: "DELETE",
  });
}
