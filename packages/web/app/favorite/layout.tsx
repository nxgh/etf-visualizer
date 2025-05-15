"use client";

import WatchListIndex from "#components/watch-list";
import { LeftExpandableLayout, Aside, Header } from "#components/layout/left-expandable-layout";
import { Input } from "@shadcn/ui/input";
import { Separator } from "@shadcn/ui/separator";
import { useQueryState } from "nuqs";

export default function Page({ children }: { children: React.ReactNode }) {
  const [q, setQuery] = useQueryState("q");

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
        <Header></Header>

        {children}
      </main>
    </LeftExpandableLayout>
  );
}
