"use client";

import { useState, useEffect, useCallback, useTransition } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
// Keep nuqs for 'code' param, or remove if not used
import { useQueryState } from "nuqs";
import { isEmpty, debounce } from "lodash-es";
import localforage from "localforage";

import { Input } from "@shadcn/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@shadcn/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandDialog } from "@shadcn/ui/command";
// Removed client import as data fetching is moved to server component
// import { client } from "../client";
import { DialogTitle } from "@radix-ui/react-dialog";

// Assuming actions are still needed for favorites
import * as actions from "../actions";
// import type { SearchResult } from "../actions"; // Type might be needed if favorites use it

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

// Removed useSearchSecurity hook

function useFavorite() {
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);

  useEffect(() => {
    const fetchFavorite = async () => {
      // Assuming getFavorite action exists and works
      // const favorite = await actions.getFavorite();
      // setFavorites(favorite.data);
      // Placeholder using localforage until actions are confirmed/implemented
      const storedFavorites = (await localforage.getItem<FavoriteItem[]>("favorites")) || [];
      setFavorites(storedFavorites);
    };
    fetchFavorite();
  }, []);

  async function toggleFavorite(item: FavoriteItem) {
    const isFavorite = favorites.some((f) => f.code === item.code);
    let updatedFavorites;

    if (isFavorite) {
      // await actions.deleteFavorite(item.code);
      updatedFavorites = favorites.filter((f) => f.code !== item.code);
    } else {
      // await actions.addFavorite(item);
      updatedFavorites = [...favorites, item];
    }
    setFavorites(updatedFavorites);
    // Persist to localforage as placeholder
    await localforage.setItem("favorites", updatedFavorites);
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
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [inputValue, setInputValue] = useState(searchParams.get("keyword") || ""); // Input state for the dialog
  const [isPending, startTransition] = useTransition();

  const { open, setOpen } = useOpenSearch();
  // Removed useSearchSecurity hook

  const handleInputChange = (value: string) => {
    setInputValue(value);
  };

  return (
    <div className="space-y-2">
      {/* Input that triggers the CommandDialog */}
      <div className="flex items-center gap-2 relative">
        <Input
          className="m-2"
          placeholder="Search by code or name..."
          value={inputValue}
          onChange={(e) => handleInputChange(e.target.value)}
          readOnly
        />
        <kbd className="absolute right-4 pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
          <span className="text-xs">⌘</span>K
        </kbd>
      </div>
    </div>
  );
}
