"use client";

import WatchListIndex from "#components/watch-list";
import { LeftExpandableLayout, Aside } from "#components/layout/left-expandable-layout";
import { Input } from "@shadcn/ui/input";
import { Separator } from "@shadcn/ui/separator";
import { useQueryState } from "nuqs";


import { useRouter } from "next/navigation";

export default function FavoriteLayout({ children }: { children: React.ReactNode }) {
  const [q, setQuery] = useQueryState("q");
  const router = useRouter();

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
            router.push(`/favorite/${code}`);
          }}
        />
      </Aside>

      {children}
    </LeftExpandableLayout>
  );
}
