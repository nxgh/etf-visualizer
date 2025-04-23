"use client";

import { useEffect } from "react";

import SearchSecurityTrigger from "./search-security/trigger";
import FavoriteList from "./favorite-list";
import SearchSecurityContent from "./search-security/client.content";
import SecurityList from "./search-security/client.security-list";

import { useSecurityStore } from "./use-store";
import { getFavoriteListAction } from "./action";

export default function Page() {
  const initFavoriteList = useSecurityStore((state) => state.initFavoriteList);

  useEffect(() => {
    const fetchFavoriteList = async () => {
      const favoriteList = await getFavoriteListAction();
      initFavoriteList(favoriteList);
    };
    fetchFavoriteList();
  }, []);

  return (
    <aside className="w-[300px] h-full border-l border-gray-200 p-4">
      <SearchSecurityTrigger>
        <SearchSecurityContent />
        <SecurityList />
      </SearchSecurityTrigger>
      <FavoriteList />
    </aside>
  );
}
