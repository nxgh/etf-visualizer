"use client";

import { Command, CommandList, CommandEmpty, CommandGroup, CommandItem, CommandSeparator } from "@shadcn/ui/command";

import { useWatchListStore } from "#store";
import { useRouter } from "next/navigation";

export default function WatchList() {
  const router = useRouter();
  const watchList = useWatchListStore((state) => state.watchList);

  const removeFavoriteList = useWatchListStore((state) => state.removeFromWatchList);

  const handleRemoveFavorite = (code: string) => {
    removeFavoriteList(code);
  };

  const handleClickItem = (code: string) => {
    router.push(`?code=${code}`);
  };

  return (
    <Command>
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Favorite">
          {watchList?.map((item) => (
            <CommandItem key={item.code} className="flex justify-between cursor-pointer">
              <div className="text-sm flex items-center justify-between gap-2 w-full" onClick={() => handleClickItem(item.code)}>
                <span>
                  {item.name}
                  <span className="text-xs text-gray-500"> [{item.code}]</span>
                </span>
              </div>
              <span className="text ml-2 hover:bg-gray-200 rounded-full p-1" onClick={() => handleRemoveFavorite(item.code)}>
                ❌
              </span>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </Command>
  );
}
