"use client";

import { useState, useEffect, useCallback, useMemo } from "react";

import { Input } from "@shadcn/ui/input";

import { searchSecurity } from "../action";
import SecurityList from "./security-list";
import type { SearchServiceResponse, ResponseResultType } from "@etf-visualizer/server";
import { debounce } from "lodash-es";

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
          setData(res);
        });
      }, 1000),
    []
  );

  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  // 直接在 onChange 事件中使用防抖函数
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
