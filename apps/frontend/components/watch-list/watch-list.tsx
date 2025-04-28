"use client";

import { CommandItem } from "@shadcn/ui/command";
import SimpleList from "@shadcn/component/list";

import { useRouter } from "next/navigation";

import type { IWatchListItem } from "#store";
import { Button } from "@shadcn/ui/button";

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
    <div className="h-full flex flex-col overflow-x-hidden overflow-y-auto">
      {props.watchList.map((item) => {
        return (
          <div key={item.code} className="flex justify-between hover:bg-gray-100 cursor-pointer p-1 px-2 rounded-xl">
            <div className="flex flex-1 items-center gap-2 " onClick={() => handleClickItem(item.code)}>
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
  );
}
