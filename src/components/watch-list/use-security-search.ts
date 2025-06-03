import { useState, useMemo, useEffect } from "react";
import { debounce } from "lodash-es";
import { searchSecurityAction, type SearchResponse } from "#actions/index";
import { useQueryState } from "nuqs";
import * as watchListAction from "./use-store-action";

export type SecuritySearchItem = Pick<IWatchList, "code" | "name" | "type"> & { isFavorite?: boolean };

export function useSecuritySearch() {
  const watchList = watchListAction.useWatchList();

  const [searchData, setSearchData] = useState<SecuritySearchItem[]>([]);
  const [loading, setLoading] = useState(false);

  const [q] = useQueryState("q");

  const onSearch = (res: string) => {
    searchSecurityAction(res)
      .then((res) => {
        console.log("res", res);
        setSearchData(res as unknown as SearchResponse);
      })
      .finally(() => {
        setLoading(false);
      });
  };

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

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (q) {
      setLoading(true);
      debouncedSearch(q);
    } else {
      setSearchData([]);
      setLoading(false);
    }
  }, [q]);

  useEffect(() => {
    return () => debouncedSearch.cancel();
  }, [debouncedSearch]);

  const showList = useMemo(() => {
    const filteredList = searchData.map((item) => {
      const isFavorite = watchList.some((watchItem) => watchItem.code === item.code);
      return isFavorite ? { ...item, isFavorite } : item;
    });
    return filteredList;
  }, [watchList, searchData]);

  const clearSearch = () => {
    setSearchData([]);
  };

  return {
    showList,
    clearSearch,
    loading,
  };
}
