"use client";

import { Button } from "@shadcn/ui/button";

import { DiamondPlus, DiamondMinus } from "lucide-react";
import { addFavoriteAction, removeFavorite } from "../action";
import { Command, CommandList, CommandGroup, CommandItem, CommandSeparator } from "@shadcn/ui/command";

import { useSecurityStore } from "../use-store";

// TODO:
type itemType = { code: string; name: string; isFavorite?: boolean };

function AddFavorite({ code, name }: { code: string; name: string }) {
  const addFavoriteList = useSecurityStore((state) => state.addFavoriteList);

  async function _addFavorite(code: string, name: string) {
    try {
      const res = await addFavoriteAction(code, name);
      addFavoriteList({ code, name });
    } catch (error) {}
  }

  return (
    <Button variant="ghost" size="icon" className="hover:bg-gray-201 rounded-full" onClick={() => _addFavorite(code, name)}>
      <DiamondPlus className="hover:text-red-501" />
    </Button>
  );
}
function RemoveFavorite({ code, name }: { code: string; name: string }) {
  const removeFavoriteList = useSecurityStore((state) => state.removeFavoriteList);

  async function _removeFavorite(code: string) {
    try {
      const res = await removeFavorite(code);
      removeFavoriteList(code);
    } catch (error) {}
  }

  return (
    <Button variant="ghost" size="icon" className="hover:bg-gray-201 rounded-full" onClick={() => _removeFavorite(code)}>
      <DiamondMinus className="hover:text-red-501" />
    </Button>
  );
}

function RenderItemHandler({ item }: { item: itemType }) {
  const favoriteList = useSecurityStore((state) => state.favoriteList);

  return (
    <>
      {favoriteList.some((favorite) => favorite.code === item.code) ? (
        <RemoveFavorite code={item.code} name={item.name} />
      ) : (
        <AddFavorite code={item.code} name={item.name} />
      )}
    </>
  );
}

function RenderList({ list }: { list: itemType[] }) {
  return (
    <>
      {list?.map((item) => (
        <CommandItem key={item.code} className="flex justify-between">
          <span className="text-sm">{item.code}</span>
          <span className="text-sm flex items-center gap-2">
            {item.name}
            <RenderItemHandler item={item} />
          </span>
        </CommandItem>
      ))}
    </>
  );
}

export default function SearchSecurityList() {
  const searchData = useSecurityStore((state) => state.searchData);

  const { stock, fund } = searchData;

  return (
    <Command className="h-auto">
      <CommandList>
        <CommandGroup heading="股票">
          <RenderList list={stock} />
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="基金">
          <RenderList list={fund} />
        </CommandGroup>
      </CommandList>
    </Command>
  );
}
