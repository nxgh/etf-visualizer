"use client";

import { Button } from "@shadcn/ui/button";

import { DiamondPlus, DiamondMinus } from "lucide-react";
import { Command, CommandList, CommandGroup, CommandItem, CommandSeparator } from "@shadcn/ui/command";
import { StockItem } from "@etf-visualizer/spider";
import type { SearchResponse } from "#actions/index";

type itemType = StockItem & { isFavorite?: boolean };

export type SearchDialogListProps = {
  list: SearchResponse;
  onClick: (type: "remove" | "add", params: itemType) => void;
};

function RenderSearchList({ list, onClick }: { list: itemType[]; onClick: SearchDialogListProps["onClick"] }) {
  return (
    <>
      {list?.map((item) => (
        <CommandItem key={item.code} className="flex justify-between">
          <span className="text-sm">{item.code}</span>
          <span className="text-sm flex items-center gap-2">
            {item.name}
            {item.isFavorite ? (
              <Button variant="ghost" size="icon" className="hover:bg-gray-201 rounded-full" onClick={() => onClick("remove", item)}>
                <DiamondMinus className="hover:text-red-501" />
              </Button>
            ) : (
              <Button variant="ghost" size="icon" className="hover:bg-gray-201 rounded-full" onClick={() => onClick("add", item)}>
                <DiamondPlus className="hover:text-red-501" />
              </Button>
            )}
          </span>
        </CommandItem>
      ))}
    </>
  );
}

export default function SearchDialogList({ list, onClick }: SearchDialogListProps) {
  const stock = list.filter((item) => item.type === "stock");
  const fund = list.filter((item) => item.type === "fund");
  return (
    <Command className="h-auto">
      <CommandList>
        <CommandGroup heading="股票">
          <RenderSearchList list={stock} onClick={onClick} />
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="基金">
          <RenderSearchList list={fund} onClick={onClick} />
        </CommandGroup>
      </CommandList>
    </Command>
  );
}
