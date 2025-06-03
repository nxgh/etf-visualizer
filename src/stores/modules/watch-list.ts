import { useShallow } from "zustand/shallow";
import { createPersistStore, createSelectors } from "../core";

import type { WatchList } from "../types/type.d";

interface WatchListStore {
  watchList: WatchList[];
  insert: (params: Pick<WatchList, "code" | "name" | "type">) => void;
  update: (params: WatchList) => void;
  remove: (code: string) => void;
}

function createInsert({ code, name, type }: Pick<WatchList, "code" | "name" | "type">) {
  return {
    code,
    name,
    type,
    id: code,
    create_at: Date.now().toString(),
    update_at: Date.now().toString(),
  };
}

const watchListStore = createPersistStore<WatchListStore>(
  "watch-list",
  {
    watchList: [],
  },
  (set) => ({
    watchList: [],
    insert: (params: Pick<WatchList, "code" | "name" | "type">) => {
      set((state) => ({ watchList: [...state.watchList, createInsert(params)] }), undefined, "watch-list/insert");
    },
    update: (params: WatchList) => {
      set(
        (state) => ({
          ...state,
          watchList: state.watchList.map((item) => (item.id === params.id ? params : item)),
        }),
        undefined,
        "watch-list/update"
      );
    },
    remove: (code: string) => {
      set(
        (state) => ({
          watchList: state.watchList.filter((item) => item.code !== code),
        }),
        undefined,
        "watch-list/remove"
      );
    },

    init: (watchList: WatchList[]) => {
      set((state) => ({ watchList }), undefined, "watch-list/init");
    },
  })
);

export const insertWatchList = (params: Pick<WatchList, "code" | "name" | "type">) => {
  watchListStore.setState((state) => ({
    watchList: [...state.watchList, createInsert(params)],
  }));
};

export const removeWatchList = (code: string) => {
  watchListStore.setState((state) => ({
    watchList: state.watchList.filter((item) => item.id !== code),
  }));
};





const watchListStoreAction = createSelectors(watchListStore);

export { watchListStore, watchListStoreAction };
