import { useState, useMemo, useEffect } from "react";
import { debounce } from "lodash-es";
import { searchSecurityAction, type SearchResponse } from "#actions/index";
import type { IWatchListItem } from "#store";

export type SecuritySearchItem = SearchResponse[number] & { isFavorite?: boolean };

export function useSecuritySearch(watchList: IWatchListItem[]) {
  const [searchData, setSearchData] = useState<SecuritySearchItem[]>([]);
  const [keyword, setKeyword] = useState("");

  const onSearch = (res: string) => {
    searchSecurityAction(res).then((res) => {
      setSearchData(res as unknown as SearchResponse);
    });
  };

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

  const showList = useMemo(() => {
    const filteredList = searchData.map((item) => {
      const isFavorite = watchList.some((watchItem) => watchItem.code === item.code);
      return isFavorite ? { ...item, isFavorite } : item;
    });
    return [
      {
        groupName: "股票",
        items: filteredList.filter((item) => item.type === "stock"),
      },
      {
        groupName: "基金",
        items: filteredList.filter((item) => item.type === "fund"),
      },
    ];
  }, [watchList, searchData]);

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

  const clearSearch = () => {
    setSearchData([]);
    setKeyword("");
  };

  return {
    keyword,
    showList,
    handleInputChange,
    updateSearchData,
    clearSearch,
  };
}