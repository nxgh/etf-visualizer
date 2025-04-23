import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@shadcn/ui/dialog";

import { useWatchListStore } from "#store";
import { debounce } from "lodash-es";
import { useState, useMemo, useEffect } from "react";
import { searchSecurityAction } from "#actions/index";
import { Input } from "@shadcn/ui/input";
import SearchDialogList from "./search-dialog-list";
import type { SearchResponse } from "#actions/index";
import type { SearchDialogListProps } from "./search-dialog-list";

export default function SearchDialog() {
  const [searchData, setSearchData] = useState<(SearchResponse[number] & { isFavorite?: boolean })[]>([]);

  const watchList = useWatchListStore((state) => state.watchList); // 从 Zustand 中获取 watchLis
  const addToWatchList = useWatchListStore((state) => state.addToWatchList);
  const removeFavoriteList = useWatchListStore((state) => state.removeFromWatchList);

  const onSearch = (res: string) => {
    searchSecurityAction(res).then((res) => {
      setSearchData(res as unknown as SearchResponse);
    });
  };
  function onOpenChange(open: boolean) {
    if (!open) {
      setSearchData([]);
    }
  }

  const onDialogListItemClick: SearchDialogListProps["onClick"] = (type, params) => {
    console.log("onDialogListItemClick", type, params);
    type === "add" ? addToWatchList(params) : removeFavoriteList(params.code);

    setSearchData((data) =>
      data.map((item) => {
        if (item.code === params.code) {
          item.isFavorite = true;
        }
        return item;
      })
    );
  };

  return (
    <Dialog onOpenChange={onOpenChange}>
      <DialogTrigger>
        <div className="flex items-center gap-2 relative">
          <div className="inline-flex items-center gap-2 whitespace-nowrap transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&amp;_svg]:pointer-events-none [&amp;_svg]:size-4 [&amp;_svg]:shrink-0 border border-input hover:bg-accent hover:text-accent-foreground px-4 py-2 relative h-8 w-full justify-start rounded-[0.5rem] bg-muted/50 text-sm font-normal text-muted-foreground shadow-none sm:pr-12 md:w-40 lg:w-56 xl:w-64">
            <span className="hidden lg:inline-flex">Search Security...</span>
            <span className="inline-flex lg:hidden">Search Security...</span>
            <kbd className="pointer-events-none absolute right-[0.3rem] top-[0.3rem] hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
              <span className="text-xs">⌘</span>K
            </kbd>
          </div>
        </div>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Search Security</DialogTitle>
        </DialogHeader>
        <SearchSecurity onSearch={onSearch} />
        <SearchDialogList list={searchData} onClick={onDialogListItemClick} />
      </DialogContent>
    </Dialog>
  );
}
export function SearchSecurity({ onSearch }: { onSearch?: (res: string) => void }) {
  const [keyword, setKeyword] = useState("");

  const debouncedSearch = useMemo(
    () =>
      debounce((kw: string) => {
        if (!kw.trim()) {
          return;
        }

        onSearch && onSearch(kw);
      }, 1000),
    []
  );

  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setKeyword(value);
    debouncedSearch(value);
  };

  return (
    <div className="space-y-2h-[400px] flex items-center gap-2 relative">
      <Input className="m-2" placeholder="Search..." value={keyword} onChange={handleInputChange} />
    </div>
  );
}
