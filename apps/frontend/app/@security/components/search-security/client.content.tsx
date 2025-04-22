"use client";

import { useState, useEffect, useCallback, useMemo } from "react";

import { Input } from "@shadcn/ui/input";

import { searchSecurity } from "./action";
import SecurityList from "./client.security-list";
import type { ResponseResultType } from "@etf-visualizer/server";
import { debounce } from "lodash-es";

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
  const [data, setData] = useState<SearchServiceResponse | null>(null);

  // 将 debounce 函数移到组件外部
  const debouncedSearch = useMemo(
    () =>
      debounce((kw: string) => {
        if (!kw.trim()) {
          setData(null);
          return;
        }
        searchSecurity(kw).then((res) => {
          setData(res as unknown as SearchServiceResponse);
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
    <div className="space-y-2 h-[400px]">
      <div className="flex items-center gap-2 relative">
        <Input className="m-2" placeholder="Search..." value={keyword} onChange={handleInputChange} />
      </div>
      <SecurityList list={data} />
    </div>
  );
}
