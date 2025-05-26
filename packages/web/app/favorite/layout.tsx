"use client";

import { useQueryState } from "nuqs";

import { watchListStoreAction } from "#store";
import { useMemo } from "react";
import { FavoriteSearch } from "#components/favorite/search";

export default function FavoriteLayout({ children }: { children: React.ReactNode }) {
  const watchListStore = watchListStoreAction.use.watchList();
  const [code, setCode] = useQueryState("code");

  const currentSecurityName = useMemo(() => {
    return watchListStore.find((item) => item.code === code)?.name;
  }, [code, watchListStore]);

  return (
    <main className="flex-1 flex flex-col overflow-hidden">
      <header className="h-12 border-b flex items-center justify-between px-4">
        <div>{currentSecurityName}</div>
        <FavoriteSearch />
        
        
      </header>
      <div className="flex-1 flex flex-col overflow-x-hidden overflow-y-auto p-4">{children}</div>
    </main>
  );
}
