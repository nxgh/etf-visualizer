"use client";

import { CommandItem } from "@shadcn/ui/command";
import SimpleList from "@shadcn/component/list";

import { useRouter } from "next/navigation";

import type { IWatchListItem } from "#store";

type Props = {
  watchList: IWatchListItem[];
  onRemoveItem: (code: string) => void;
};

export default function WatchList(props: Props) {
  const router = useRouter();

  const handleClickItem = (code: string) => {
    router.push(`?code=${code}`);
  };

  return (
    <SimpleList
      list={props.watchList}
      getKey={(item) => item.code}
      children={(item) => {
        return (
          <CommandItem key={item.code} className="flex justify-between cursor-pointer">
            <div className="text-sm flex items-center justify-between gap-2 w-full" onClick={() => handleClickItem(item.code)}>
              <span>
                {item.name}
                <span className="text-xs text-gray-500"> [{item.code}]</span>
              </span>
            </div>
            <span className="text ml-2 hover:bg-gray-200 rounded-full p-1" onClick={() => props.onRemoveItem(item.code)}>
              ❌
            </span>
          </CommandItem>
        );
      }}
    />
  );
}
