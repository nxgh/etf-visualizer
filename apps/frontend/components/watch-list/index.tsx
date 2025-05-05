"use client";
import { useEffect, useMemo } from "react";

import { SimpleCard } from "@shadcn/component";

import { SimpleList } from "@shadcn/component";
import { DiamondMinus, DiamondPlus } from "lucide-react";

import Store, { type IWatchListItem } from "#store";
import { cn } from "@shadcn/lib/utils";
import { Button } from "@shadcn/ui/button";
import { CommandItem } from "@shadcn/ui/command";
import { Input } from "@shadcn/ui/input";

import { useRouter } from "next/navigation";
import { useSecuritySearch } from "./use-security-search";
import { ScrollArea } from "@shadcn/ui/scroll-area";
import Show from "@shadcn/component/show";
import { Match, Switch } from "@shadcn/component/match";

type ItemType = IWatchListItem & { isFavorite?: boolean };

function WatchList(props: { watchList: IWatchListItem[]; onRemoveItem: (code: string) => void; className?: string }) {
  const router = useRouter();

  const handleClickItem = (code: string) => {
    router.push(`?code=${code}`);
  };

  return (
    <ScrollArea className="h-full rounded-md w-full">
      <div className={cn("h-full flex flex-col overflow-x-hidden overflow-y-auto", props.className)}>
        {props.watchList.map((item) => {
          return (
            <div
              key={item.code}
              className="flex items-end hover:bg-gray-100 cursor-pointer rounded bg-gray-50 mb-2 p-2 px-4 border border-gray-200"
            >
              <div className="flex flex-col  flex-1  gap-2 " onClick={() => handleClickItem(item.code)}>
                {item.name}
                <span className="text-xs text-gray-500"> [{item.code}]</span>
              </div>
              <span className="text ml-2 hover:bg-gray-200 rounded-full" onClick={() => props.onRemoveItem(item.code)}>
                ❌
              </span>
            </div>
          );
        })}
      </div>
    </ScrollArea>
  );
}

export default function WatchListIndex({ className }: { className?: string }) {
  // store
  const watchList = Store.use.watchList();
  const remove_watch_list = Store.use.remove_watch_list();
  const insert_to_watch_list = Store.use.insert_to_watch_list();

  // hook
  const { keyword, showList, handleInputChange, loading, clearSearch } = useSecuritySearch(watchList);

  // state
  const isSearching = useMemo(() => {
    return showList.some((item) => item.items.length > 0);
  }, [showList]);

  const isOpen = useMemo(() => {
    return keyword.length > 0;
  }, [keyword]);

  // function
  const onRemoveItem = (code: string) => {
    remove_watch_list(code);
  };

  const onInsertItem = (param: IWatchListItem) => {
    insert_to_watch_list(param);
  };

  const onClear = () => {
    clearSearch();
  };

  return (
    <div className="flex flex-col w-[280px] h-full overflow-hidden border-r p-4">
      <div className={cn("relative", className)}>
        <Input className="mb-2" placeholder="Search..." value={keyword} onChange={handleInputChange} onClear={onClear} />
      </div>

      <Show when={isOpen}>
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
                <span className="text-sm text-gray-400">[{item.code}]</span>
              </div>
              {item.isFavorite ? (
                <Button variant="ghost" size="icon" className="hover:bg-gray-201 rounded-full" onClick={() => onRemoveItem(item.code)}>
                  <DiamondMinus className="hover:text-red-501" />
                </Button>
              ) : (
                <Button variant="ghost" size="icon" className="hover:bg-gray-201 rounded-full" onClick={() => onInsertItem(item)}>
                  <DiamondPlus className="hover:text-red-501" />
                </Button>
              )}
            </CommandItem>
          )}
        </SimpleList>
      </Show>
      <Show when={!isOpen}>
        <WatchList className={isOpen ? "blur-sm" : ""} watchList={watchList} onRemoveItem={onRemoveItem} />
      </Show>
    </div>
  );
}
