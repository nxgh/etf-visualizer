import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { StateStorage } from "zustand/middleware";
import { get, set, del } from "idb-keyval";

export const storage: StateStorage = {
  getItem: async (name: string): Promise<string | null> => {
    return (await get(name)) || null;
  },
  setItem: async (name: string, value: string): Promise<void> => {
    await set(name, value);
  },
  removeItem: async (name: string): Promise<void> => {
    await del(name);
  },
};

interface StockItem {
  name: string;
  code: string;
}

interface WatchListState {
  watchList: StockItem[];
  addToWatchList: (favorite: StockItem) => void;
  removeFromWatchList: (code: string) => void;
}

export const useWatchListStore = create<WatchListState>()(
  persist(
    (set, get) => ({
      watchList: [],
      addToWatchList: (stockItem: StockItem) => {
        console.log("addToWatchList", stockItem);
        set({
          watchList: [
            ...get().watchList,
            {
              code: stockItem.code,
              name: stockItem.name,
            },
          ],
        });
      },
      removeFromWatchList: (code: string) => {
        console.log("removeFromWatchList", code);
        set({
          watchList: get().watchList.filter((f) => f.code !== code),
        });
      },
    }),
    {
      name: "watch-list-storage",
      storage: createJSONStorage(() => storage),
    }
  )
);
