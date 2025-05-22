"use client";

import WatchListIndex from "#components/watch-list";
import { LeftExpandableLayout, Aside, Header } from "#components/layout/left-expandable-layout";
import { Input } from "@shadcn/ui/input";
import { Separator } from "@shadcn/ui/separator";
import { useQueryState } from "nuqs";
import { Button } from "@shadcn/ui/button";

import { useEffect, useMemo } from "react";
import { watchListStoreAction } from "#stores/modules/watch-list";
import { TransactionTable } from "#components/transaction/table";
import { getSecurityDetailAction } from "#actions/index";

import { UploadTransaction } from "#components/transaction/upload-transaction";
import { useRouter } from "next/navigation";

export default function FavoriteLayout({ children }: { children: React.ReactNode }) {
  const [q, setQuery] = useQueryState("q");
  const [code] = useQueryState("code");
  const router = useRouter();

  const watchListStore = watchListStoreAction.use.watchList();

  const currentSecurityName = useMemo(() => {
    return watchListStore.find((item) => item.code === code)?.name;
  }, [code, watchListStore]);

  useEffect(() => {
    if (code) {
      console.log("code", code);
      getSecurityDetailAction(code as string)
        .then((res) => {
          console.log(res);
        })
        .catch((err) => {
          console.error(err);
        });
    }
  }, [code]);

  const importTransaction = (type: "JSON" | "CSV" | "Excel") => {
    console.log(type);
  };

  return (
    <LeftExpandableLayout>
      <Aside className="flex flex-col items-center border-r">
        <Input
          placeholder="Search"
          className="mb-0"
          value={q ?? ""}
          onChange={(e) => setQuery(e.target.value)}
          clearable
          onClear={() => setQuery(null)}
        />
        <Separator className="my-4" />
        <WatchListIndex
          className=""
          onClickItem={(code, type) => {
            console.log(code, type);
            router.push(`/favorite/${code}`);
          }}
        />
      </Aside>
      <main className="flex-1 flex flex-col overflow-hidden">
        <Header className="flex items-center justify-between">
          <div>{currentSecurityName}</div>
          {/* 编辑、批量编辑、导入 json/csv/excel */}
          <UploadTransaction />
        </Header>

        {children}
      </main>
    </LeftExpandableLayout>
  );
}
