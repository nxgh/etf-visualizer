import { useState, useMemo, useEffect } from "react";
import { debounce } from "lodash-es";

import { searchSecurityAction, type SearchResponse } from "#actions/index";

import { SimpleList } from "@shadcn/component";
import { DiamondMinus, DiamondPlus } from "lucide-react";

import Store, { type IWatchListItem } from "#store";
import { Dialog, DialogTrigger, DialogContent, DialogTitle } from "@shadcn/ui/dialog";
import { DialogHeader } from "@shadcn/ui/dialog";
import { Input } from "@shadcn/ui/input";
import { CommandItem } from "@shadcn/ui/command";
import { Button } from "@shadcn/ui/button";

type ItemType = IWatchListItem & { isFavorite?: boolean };

export default function SearchDialog(props: { onInsertItem: (item: ItemType) => void; onRemoveItem: (code: string) => void }) {
  const [searchData, setSearchData] = useState<(SearchResponse[number] & { isFavorite?: boolean })[]>([]);

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

  const updateSearchData = (code: string) => {
    setSearchData((data) =>
      data.map((item) => {
        if (item.code === code) {
          item.isFavorite = false;
        }
        return item;
      })
    );
  };

  const onRemoveItem = (code: string) => {
    props.onRemoveItem(code);
    updateSearchData(code);
  };

  const onInsertItem = (param: ItemType) => {
    props.onInsertItem(param);
    updateSearchData(param.code);
  };

  const [keyword, setKeyword] = useState("");

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  const debouncedSearch = useMemo(
    () =>
      debounce((kw: string) => {
        if (!kw.trim()) {
          return;
        }
        onSearch?.(kw);
      }, 1000),
    []
  );

  useEffect(() => {
    return () => debouncedSearch.cancel();
  }, [debouncedSearch]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setKeyword(value);
    debouncedSearch(value);
  };

  const values = [
    {
      groupName: "股票",
      items: searchData.filter((item) => item.type === "stock"),
    },
    {
      groupName: "基金",
      items: searchData.filter((item) => item.type === "fund"),
    },
  ];

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
        <div className="space-y-2h-[400px] flex items-center gap-2 relative">
          <Input className="m-2" placeholder="Search..." value={keyword} onChange={handleInputChange} />
        </div>
        <SimpleList list={values} getKey={(item) => item.code}>
          {(item: ItemType) => (
            <CommandItem key={item.code} className="flex justify-between">
              <span className="text-sm">{item.code}</span>
              <span className="text-sm flex items-center gap-2">
                {item.name}
                {item.isFavorite ? (
                  <Button variant="ghost" size="icon" className="hover:bg-gray-201 rounded-full" onClick={() => onRemoveItem(item.code)}>
                    <DiamondMinus className="hover:text-red-501" />
                  </Button>
                ) : (
                  <Button variant="ghost" size="icon" className="hover:bg-gray-201 rounded-full" onClick={() => onInsertItem(item)}>
                    <DiamondPlus className="hover:text-red-501" />
                  </Button>
                )}
              </span>
            </CommandItem>
          )}
        </SimpleList>
      </DialogContent>
    </Dialog>
  );
}
