"use client";

import WatchListIndex from "#components/watch-list";
import { LeftExpandableLayout, Aside, Header } from "#components/layout/left-expandable-layout";
import { Input } from "@shadcn/ui/input";
import { Separator } from "@shadcn/ui/separator";
import { useQueryState } from "nuqs";
import { Button } from "@shadcn/ui/button";

import { useMemo } from "react";
import { watchListStoreAction } from "#stores/modules/watch-list";
import { TransactionTable } from "#components/transaction/table";
import { TransactionChart } from "#components/transaction/chart";
export default function Page() {
  const [q, setQuery] = useQueryState("q");
  const [code] = useQueryState("code");

  const watchListStore = watchListStoreAction.use.watchList();

  const currentSecurityName = useMemo(() => {
    return watchListStore.find((item) => item.code === code)?.name;
  }, [code, watchListStore]);

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
        <WatchListIndex className="" />
      </Aside>
      <main className="flex-1 flex flex-col overflow-hidden">
        <Header>
          {currentSecurityName}
          <Button size="sm">策略</Button>
        </Header>
        <TransactionTable code={code as string} />
        <TransactionChart code={code as string} />
      </main>
    </LeftExpandableLayout>
  );
}
