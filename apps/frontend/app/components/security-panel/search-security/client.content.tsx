"use client";

import { useState, useEffect, useMemo } from "react";

import { Input } from "@shadcn/ui/input";

import { searchSecurityAction } from "../action";

import { debounce } from "lodash-es";

import { useSecurityStore } from "../use-store";

// TODO:
type SearchServiceResponseItem = {
  code: string;
  name: string;
  isFavorite?: boolean;
};

type SearchServiceResponse = {
  stock: SearchServiceResponseItem[];
  fund: SearchServiceResponseItem[];
};

export default function SearchSecurityContent() {
  const [keyword, setKeyword] = useState("");
  const setSearchData = useSecurityStore((state) => state.setSearchData);

  // 将 debounce 函数移到组件外部
  const debouncedSearch = useMemo(
    () =>
      debounce((kw: string) => {
        if (!kw.trim()) {
          setSearchData();
          return;
        }

        searchSecurityAction(kw).then((res) => {
          setSearchData(res as unknown as SearchServiceResponse);
        });
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
