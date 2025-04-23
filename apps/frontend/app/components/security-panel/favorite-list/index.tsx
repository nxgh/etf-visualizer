"use client";

import { Command, CommandList, CommandEmpty, CommandGroup, CommandItem, CommandSeparator } from "@shadcn/ui/command";

import { useSecurityStore } from "../use-store";
import { removeFavorite } from "../action";
import { useRouter } from "next/navigation";

export default function FavoriteList() {
  const router = useRouter();
  const favoriteList = useSecurityStore((state) => state.favoriteList);

  const removeFavoriteList = useSecurityStore((state) => state.removeFavoriteList);

  const handleRemoveFavorite = (code: string) => {
    removeFavorite(code);
    removeFavoriteList(code);
  };

  const handleClickItem = (code: string) => {
    router.push(`/security/${code}`);
  };

  return (
    <Command>
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Favorite">
          {favoriteList?.map((item) => (
            <CommandItem key={item.code} className="flex justify-between cursor-pointer">
              <div className="text-sm flex items-center justify-between gap-2 w-full" onClick={() => handleClickItem(item.code)}>
                <span>{item.code}</span>
                <span>{item.name}</span>
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
