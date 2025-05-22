"use client";

import { Header } from "#components/layout/left-expandable-layout";
import { watchListStoreAction } from "#stores/modules/watch-list";
import { use, useMemo } from "react";

export default function FavoriteLayout({ children, params }: { children: React.ReactNode; params: Promise<{ code: string }> }) {
  const { code } = use(params);

  const watchListStore = watchListStoreAction.use.watchList();

  const currentSecurityName = useMemo(() => {
    return watchListStore.find((item) => item.code === code)?.name;
  }, [code, watchListStore]);

  return (
    <main className="flex-1 flex flex-col overflow-hidden">
      <Header className="flex items-center justify-between">
        <div>{currentSecurityName}</div>
        {/* 编辑、批量编辑、导入 json/csv/excel */}
        {/* <UploadTransaction /> */}
      </Header>

      <div className="flex-1 flex flex-col overflow-hidden p-4">{children}</div>
    </main>
  );
}
