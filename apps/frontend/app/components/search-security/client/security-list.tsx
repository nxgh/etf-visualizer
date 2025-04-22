"use client";

import type { SearchServiceResponse } from "@etf-visualizer/server";
import { Button } from "@shadcn/ui/button";
import { Card, CardContent } from "@shadcn/ui/card";
import { Command, CommandList, CommandEmpty, CommandGroup, CommandItem, CommandSeparator } from "@shadcn/ui/command";

import { isEmpty } from "lodash-es";
import { DiamondPlus } from "lucide-react";
import { addFavorite } from "../action";
function AddFavorite({ code, name }: { code: string; name: string }) {
  return (
    <Button variant="ghost" size="icon" className="hover:bg-gray-200 rounded-full" onClick={() => {
      addFavorite(code, name);
    }}>
      <DiamondPlus className="hover:text-red-500" />
    </Button>
  );
}

export default function SearchSecurityList({ list }: { list: SearchServiceResponse | null }) {
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
                <AddFavorite code={item.code} name={item.name} />
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
                <AddFavorite code={item.code} name={item.name} />
              </span>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </Command>
  );
}
