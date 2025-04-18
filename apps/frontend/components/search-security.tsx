"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useQueryState } from "nuqs";
import { isEmpty, debounce } from "lodash-es";
import localforage from "localforage";

import { Input } from "@shadcn/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@shadcn/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandDialog } from "@shadcn/ui/command";
import { DialogTitle } from "@radix-ui/react-dialog";

import * as actions from "../actions";
import type { SearchResult } from "../actions";

interface FavoriteItem {
  code: string;
  name: string;
  type: string;
}

const SecurityListItem = ({
  item,
  isFavorite,
  onToggleFavorite,
  onClick,
}: {
  item: FavoriteItem;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  onClick?: () => void;
}) => (
  <div className="flex justify-between items-center cursor-pointer hover:bg-slate-200 border-b border-slate-200 rounded-sm p-1 text-sm">
    <div className="flex-1" onClick={onClick}>
      {item.code} - {item.name}
    </div>
    <div className="text-lg text-muted-foreground cursor-pointer" onClick={onToggleFavorite}>
      {isFavorite ? "-" : "+"}
    </div>
  </div>
);

function useSearchSecurity(query: string) {
  const [loading, setLoading] = useState(false);

  const [searchResult, setSearchResult] = useState<SearchResult>({
    fundList: [],
    stockList: [],
  });

  useEffect(() => {
    const debouncedSearch = debounce(async () => {
      if (!query || query === "") {
        setSearchResult({
          fundList: [],
          stockList: [],
        });
        return;
      }
      setLoading(true);
      const res = await actions.searchSecurity(query);

      setSearchResult({
        fundList: res.fund,
        stockList: res.stock,
      });
      setLoading(false);
    }, 1000);

    debouncedSearch();

    // 清理函数
    return () => {
      debouncedSearch.cancel();
    };
  }, [query]);

  return {
    searchResult,
    loading,
  };
}

function useFavorite() {
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);

  useEffect(() => {
    const fetchFavorite = async () => {
      const favorite = await actions.getFavorite();
      setFavorites(favorite.data);
    };
    fetchFavorite();
  }, []);

  async function toggleFavorite(item: FavoriteItem) {
    const isFavorite = favorites.some((f) => f.code === item.code);

    if (isFavorite) {
      await actions.deleteFavorite(item.code);
    } else {
      await actions.addFavorite(item);
    }

    setFavorites((prev) => {
      return isFavorite ? prev.filter((f) => f.code !== item.code) : [...prev, item];
    });
  }

  return {
    favorites,
    toggleFavorite,
  };
}

function useOpenSearch() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return {
    open,
    setOpen,
  };
}

export default function SearchSecurity() {
  const router = useRouter();
  const [query, setQuery] = useState("");

  const { open, setOpen } = useOpenSearch();
  const { searchResult, loading } = useSearchSecurity(query);
  const { favorites, toggleFavorite } = useFavorite();

  const [code, setCode] = useQueryState("code");

  async function getNets(code: string) {
    const res = await actions.getNets(code);
    console.log(res);
  }

  async function getKline(code: string) {
    const res = await actions.getKline(code);
    console.log(res);
  }
  async function onClick(item: FavoriteItem) {
    console.log(item);
    setCode(item.code);
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 relative">
        <Input className="m-2" placeholder="Search..." onFocus={() => setOpen(true)} />
        <kbd className="absolute right-4 pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
          <span className="text-xs">⌘</span>K
        </kbd>
      </div>

      <div className="space-y-1">
        {favorites.map((item) => (
          <SecurityListItem
            key={item.code}
            item={item}
            isFavorite={true}
            onToggleFavorite={() => toggleFavorite(item)}
            onClick={() => onClick(item)}
          />
        ))}
      </div>

      <CommandDialog
        open={open}
        onOpenChange={(param) => {
          setOpen(param);
          if (!param) {
            setQuery("");
          }
        }}
      >
        <DialogTitle />
        <Command shouldFilter={false}>
          <CommandInput placeholder="Type a command or search..." value={query} onValueChange={setQuery} />
          <CommandList className="min-h-[300px]">
            {isEmpty(searchResult) ? (
              <>
                <CommandEmpty>No results found.</CommandEmpty>
              </>
            ) : (
              <>
                <CommandGroup heading="基金">
                  {searchResult?.fundList.map((item) => (
                    <SecurityListItem
                      key={item.code}
                      item={item}
                      isFavorite={favorites.some((f) => f.code === item.code)}
                      onToggleFavorite={() => toggleFavorite(item)}
                      onClick={() => onClick(item)}
                    />
                  ))}
                </CommandGroup>

                <CommandGroup heading="股票">
                  {searchResult?.stockList.map((stock) => (
                    <SecurityListItem
                      key={stock.code}
                      item={stock}
                      isFavorite={favorites.some((f) => f.code === stock.code)}
                      onToggleFavorite={() => toggleFavorite(stock)}
                      onClick={() => onClick(stock)}
                    />
                  ))}
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </CommandDialog>
    </div>
  );
}
