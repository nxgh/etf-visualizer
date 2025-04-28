"use client";

import WatchList from "./watch-list";
import SearchDialog from "./search-dialog";
import { SimpleCard } from "@shadcn/component";
import { cn } from "@shadcn/lib/utils";
import Store from "#store/create-store";
import { IWatchListItem } from "#store";

export default function WatchListIndex({ className }: { className?: string }) {
  
  const watchList = Store.use.watchList();
  const remove_watch_list = Store.use.remove_watch_list();
  const insert_to_watch_list = Store.use.insert_to_watch_list();

  const onRemoveItem = (code: string) => {
    remove_watch_list(code);
  };

  const onInsertItem = (param: IWatchListItem) => {
    insert_to_watch_list(param);
  };

  return (
    <SimpleCard className={cn("h-[600px]", className)} title="Watch List">
      <SearchDialog onInsertItem={onInsertItem} onRemoveItem={onRemoveItem} />
      <WatchList watchList={watchList} onRemoveItem={onRemoveItem} />
    </SimpleCard>
  );
}
