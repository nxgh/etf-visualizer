"use client";

import { RemoveFavoriteAction } from "./actions";

export default function RemoveFavorite({ code }: { code: string }) {
  const handleRemoveFavorite = (code: string) => {
    RemoveFavoriteAction({ code });
  };
  return (
    <span className="text ml-2 hover:bg-gray-200 rounded-full p-1" onClick={() => handleRemoveFavorite(code)}>
      ❌
    </span>
  );
}
