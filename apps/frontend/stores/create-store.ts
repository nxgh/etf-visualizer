import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { IGridTradeStrategyConfig, IGridLevelRecord, IWatchListItem } from "./model.type";

import type { StoreApi, UseBoundStore } from "zustand";
import type { StateStorage } from "zustand/middleware";
import { get, set, del } from "idb-keyval";
import { createRecord, createStrategy } from "./helper";

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
  presetList: IGridTradeStrategyConfig[];
  transaction: IGridLevelRecord[];
  watchList: IWatchListItem[];
  presetListTemplate: IGridTradeStrategyConfig[];

  insert_to_preset_list: (newPreset?: IGridTradeStrategyConfig) => void;
  update_preset_list: (updatedPreset: IGridTradeStrategyConfig) => void;
  remove_preset_list: (id: string) => void;

  insert_to_watch_list: (newWatchItem: IWatchListItem) => void;
  update_watch_list: (updatedWatchItem: IWatchListItem) => void;
  remove_watch_list: (code: string) => void;

  insert_to_transaction: (newRecord?: IGridLevelRecord) => void;
  update_transaction: (updatedRecord: IGridLevelRecord) => void;
  remove_transaction: (id: string) => void;
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

type StoreTypeUnion = IGridTradeStrategyConfig | IGridLevelRecord | IWatchListItem;

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

      // preset list
      insert_to_preset_list: (newPreset: IGridTradeStrategyConfig = createStrategy()) => {
        insert(set)(STORE_KEYS.PRESET_LIST, newPreset);
      },
      update_preset_list: (updatedPreset: IGridTradeStrategyConfig) => {
        update(set)<IGridTradeStrategyConfig>(STORE_KEYS.PRESET_LIST, "id" as keyof IGridTradeStrategyConfig, updatedPreset);
      },
      remove_preset_list: (id: string) => {
        remove(set)<IGridTradeStrategyConfig>(STORE_KEYS.PRESET_LIST, "id" as keyof IGridTradeStrategyConfig, id);
      },

      // watch list
      insert_to_watch_list: (newWatchItem: IWatchListItem) => {
        insert(set)(STORE_KEYS.WATCH_LIST, newWatchItem);
      },
      update_watch_list: (updatedWatchItem: IWatchListItem) => {
        update(set)<IWatchListItem>(STORE_KEYS.WATCH_LIST, "id" as keyof IWatchListItem, updatedWatchItem);
      },
      remove_watch_list: (id: string) => {
        remove(set)<IWatchListItem>(STORE_KEYS.WATCH_LIST, "code" as keyof IWatchListItem, id);
      },
      // 交易记录
      insert_to_transaction: (
        newRecord: IGridLevelRecord = createRecord({ positionIndex: get()[STORE_KEYS.TRANSACTION].length + 1, level: 1 })
      ) => {
        insert(set)(STORE_KEYS.TRANSACTION, newRecord);
      },
      update_transaction: (updatedRecord: IGridLevelRecord) => {
        update(set)<IGridLevelRecord>(STORE_KEYS.TRANSACTION, "id" as keyof IGridLevelRecord, updatedRecord);
      },
      remove_transaction: (id: string) => {
        console.log("remove_transaction", id);
        remove(set)<IGridLevelRecord>(STORE_KEYS.TRANSACTION, "id" as keyof IGridLevelRecord, id);
      },
    }),
    {
      name: "grid-trade-storage",
      storage: createJSONStorage(() => storage),
    }
  )
);

export default createSelectors(useStore);
