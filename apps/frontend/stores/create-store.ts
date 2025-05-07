import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

import type { StoreApi, UseBoundStore } from "zustand";
import type { StateStorage } from "zustand/middleware";
import { get, set, del } from "idb-keyval";
import { createRecord, createStrategy } from "./helper";
import { useMemo } from "react";

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

// 为 window 声明全局类型
declare global {
  interface Window {
    _st: any;
  }
}
if (globalThis.window) globalThis.window._st = async () => JSON.parse((await storage.getItem("grid-trade-storage")) || "{}");

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

// 定义 Store 的整体状态结构
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

// 定义 Store 中各个 slice 的 key 常量

// 定义 Store 名称的联合类型
export type StoreName = keyof StoreState; // 使用 keyof 简化

type StoreTypeUnion = IStrategyConfig | ITransactionRecord | IWatchList;

type SetFuncType = {
  (partial: StoreState | Partial<StoreState> | ((state: StoreState) => StoreState | Partial<StoreState>), replace?: false): void;
  (state: StoreState | ((state: StoreState) => StoreState), replace: true): void;
};

const update =
  (set: SetFuncType) =>
  <T extends StoreTypeUnion>(key: keyof StoreState, idField: keyof T, updatedItem: T) => {
    set((state) => ({
      [key]: (state[key] as T[]).map((item: T) => (item[idField] === updatedItem[idField] ? updatedItem : item)),
    }));
  };

const insert = (set: SetFuncType) => (key: keyof StoreState, newItem: StoreTypeUnion) =>
  set((state) => ({ [key]: [...(state[key] as StoreTypeUnion[]), newItem] }));

const remove =
  (set: SetFuncType) =>
  <T extends StoreTypeUnion>(key: keyof StoreState, idField: keyof T, id: string | number) => {
    set((state) => ({
      [key]: (state[key] as T[]).filter((item: T) => item[idField] !== id),
    }));
  };

// 创建 Zustand Store 实例
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

const Store = createSelectors(useStore);

/**
 * @description 新建交易记录
 * @param params
 */
export const addTransactionItem = (params: BaseParams<ITransactionRecord>) => {
  useStore.setState((state) => {
    const newRecord = createRecord({
      level: 1,
      ...params,
    });
    return { transaction: [...state.transaction, newRecord] };
  });
};

export const removeWatchList = (code: string) => {
  useStore.setState((state) => {
    return { watchList: state.watchList.filter((item) => item.code !== code) };
  });
};

export const insertWatchList = (params: Pick<IWatchList, "code" | "name" | "type">) => {
  useStore.setState((state) => ({
    watchList: [
      ...state.watchList,
      {
        ...params,
        create_at: Date.now().toString(),
        update_at: Date.now().toString(),
      },
    ],
  }));
};

export const insertStrategy = (params: IStrategyConfig) => {
  useStore.setState((state) => ({
    presetList: [
      ...state.presetList,
      {
        ...params,
        create_at: Date.now().toString(),
        update_at: Date.now().toString(),
      },
    ],
  }));
};

export const updateStrategy = (params: IStrategyConfig) => {
  useStore.setState((state) => ({
    presetList: state.presetList.map((item) => (item.id === params.id ? params : item)),
  }));
};

export const insertRecord = (params: BaseParams<ITradRecord>) => {
  useStore.setState((state) => ({
    transaction: [
      ...state.transaction,
      createRecord({
        level: 1,
        ...params,
      }),
    ],
  }));
};

export const updateTransaction = (params: BaseParams<ITradRecord>) => {
  useStore.setState((state) => ({
    transaction: state.transaction.map((item) => (item.id === params.id ? { ...item, ...params } : item)),
  }));
};

export const removeRecord = (id: string) => {
  useStore.setState((state) => ({
    transaction: state.transaction.filter((item) => item.id !== id),
  }));
};

export const useFilteredRecord = (code: string) => {
  const record = Store.use.transaction();
  return useMemo(() => record.filter((item) => item.code === code), [record, code]);
};

export default Store;
