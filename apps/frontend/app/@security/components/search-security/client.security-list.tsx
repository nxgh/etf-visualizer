import type { SearchServiceResponse } from "@etf-visualizer/server";
import { Command, CommandList, CommandGroup, CommandItem, CommandSeparator } from "@shadcn/ui/command";

import AddFavorite from "./client.add-favorite";
import { getFavorites } from "./action";

// TODO:
type itemType = { code: string; name: string; isFavorite?: boolean };

export default function SearchSecurityList({ list }: { list: { stock?: itemType[]; fund: itemType[] } | null }) {
  const { stock, fund } = list || {};

  return (
    <Command className="h-auto">
      <CommandList>
        <CommandGroup heading="股票">
          {stock?.map((item) => (
            <CommandItem key={item.code} className="flex justify-between">
              <span className="text-sm">{item.code}</span>
              <span className="text-sm flex items-center gap-2">
                {item.name}

                {item?.isFavorite ? <span className="text-red-500">❤️</span> : <AddFavorite code={item.code} name={item.name} />}
              </span>
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="基金">
          {fund?.map((item) => (
            <CommandItem key={item.code} className="flex justify-between">
              <span className="text-sm">{item.code}</span>
              <span className="text-sm flex items-center gap-2">
                {item.name}

                {item?.isFavorite ? <span className="text-red-500">❤️</span> : <AddFavorite code={item.code} name={item.name} />}
              </span>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </Command>
  );
}
