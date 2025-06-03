"use client";


import { SimpleList } from "@shadcn/component";
import { DiamondMinus, DiamondPlus } from "lucide-react";

import { cn } from "@shadcn/lib/utils";
import { Button } from "@shadcn/ui/button";
import { CommandItem } from "@shadcn/ui/command";

import { useSecuritySearch } from "./use-security-search";
import { Match } from "@shadcn/component/match";
import { useQueryState } from "nuqs";

import { watchListStoreAction } from "#stores/index";
import type { WatchList } from "#stores/types/type.d";
type ItemType = Pick<WatchList, "code" | "name" | "type"> & { isFavorite?: boolean };

// 涨跌% label

export function FavoriteSearchList({ className }: { className?: string }) {
  // store
  const removeWatchList = watchListStoreAction.use.remove();
  const insertWatchList = watchListStoreAction.use.insert();

  // hook
  const { showList, loading } = useSecuritySearch();

  // state
  const [q] = useQueryState("q");

  return (
    <div id="watch-list" className={cn("flex flex-col w-full h-full overflow-hidden overflow-y-auto ", className)}>
      <Match when={q}>
        <SimpleList
          loading={loading}
          emptyContent={<div className="text-sm text-gray-400">No result found</div>}
          className={cn("w-full h-full z-10 bg-transparent backdrop-blur-[14px]")}
          list={showList}
          getKey={(item) => item.code}
        >
          {(item: ItemType) => (
            <CommandItem key={item.code} className="flex items-end justify-between">
              <div className="text-sm flex flex-col  gap-2">
                <span className="text-base">{item.name}</span>
                <span className="text-sm text-gray-400">
                  [{item.code}]<span className="ml-4 text-xs text-gray-400">{item.type}</span>
                </span>
              </div>
              {item.isFavorite ? (
                <Button variant="ghost" size="icon" className="hover:bg-gray-201 rounded-full" onClick={() => removeWatchList(item.code)}>
                  <DiamondMinus className="hover:text-red-501" />
                </Button>
              ) : (
                <Button variant="ghost" size="icon" className="hover:bg-gray-201 rounded-full" onClick={() => insertWatchList(item)}>
                  <DiamondPlus className="hover:text-red-501" />
                </Button>
              )}
            </CommandItem>
          )}
        </SimpleList>
      </Match>
    </div>
  );
}
