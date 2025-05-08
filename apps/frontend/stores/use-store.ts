import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

import type { StateStorage } from "zustand/middleware";
import { get, set, del } from "idb-keyval";

import type { StoreApi, UseBoundStore } from "zustand";

type WithSelectors<S> = S extends { getState: () => infer T } ? S & { use: { [K in keyof T]: () => T[K] } } : never;

export const createSelectors = <S extends UseBoundStore<StoreApi<object>>>(_store: S) => {
  const store = _store as WithSelectors<typeof _store>;
  store.use = {};
  for (const k of Object.keys(store.getState())) {
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    (store.use as any)[k] = () => store((s) => s[k as keyof typeof s]);
  }
  return store;
};

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

export interface StoreState {
  presetList: IStrategyConfig[];
  transaction: ITransactionRecord[];
  watchList: IWatchList[];
}

export const STORE_KEYS = {
  PRESET_LIST: "presetList",
  PRESET_LIST_TEMPLATE: "presetListTemplate",
  TRANSACTION: "transaction",
  WATCH_LIST: "watchList",
} as const;

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      [STORE_KEYS.PRESET_LIST]: [],
      [STORE_KEYS.TRANSACTION]: [],
      [STORE_KEYS.WATCH_LIST]: [],
      [STORE_KEYS.PRESET_LIST_TEMPLATE]: [],
    }),
    {
      name: "grid-trade-storage",
      storage: createJSONStorage(() => storage),
    }
  )
);

export const Store = createSelectors(useStore);
