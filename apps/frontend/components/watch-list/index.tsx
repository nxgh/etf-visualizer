"use client";

import WatchList from "./watch-list";
import SearchDialog from "./search-dialog";

export default function Page() {
  return (
    <aside className="w-[300px] h-full border-l border-gray-200 p-4">
      <SearchDialog />
      <WatchList />
    </aside>
  );
}
