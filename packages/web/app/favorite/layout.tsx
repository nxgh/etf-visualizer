"use client";

import { useQueryState } from "nuqs";

import { watchListStoreAction } from "#store";
import { useMemo, useState } from "react";
import { FavoriteSearch } from "#components/favorite/search";
import { Move, PanelLeftOpen, PanelRightOpen, Pin } from "lucide-react";
import { layoutStoreAction, useLayoutFilterByIds } from "#stores/modules/layout";

const ChangeStatic = () => {
  const changeStatic = layoutStoreAction.use.changeStatic();

  const isStatic = useLayoutFilterByIds(["favorite-list", "favorite-kline", "favorite-transaction"]).every((item) => item.static);

  function handleChangeStatic() {
    changeStatic(["favorite-list", "favorite-kline", "favorite-transaction"]);
  }

  return (
    <span className="flex items-center gap-2" onClick={() => handleChangeStatic()}>
      {isStatic ? <Pin className="cursor-pointer" /> : <Move className="cursor-pointer" />}
    </span>
  );
};

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

        <div className="flex items-center gap-2">
          <ChangeStatic />
          <PanelLeftOpen />
          <PanelRightOpen />
        </div>
      </header>
      <div className="flex-1 flex flex-col overflow-x-hidden overflow-y-auto p-4">{children}</div>
    </main>
  );
}
