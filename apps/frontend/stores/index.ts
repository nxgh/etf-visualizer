import { createRecord, createStrategy } from "./helper";
import { useMemo } from "react";
import { merge } from "lodash-es";

import { useStore, Store } from "./use-store";

/**
 * @description 新建交易记录
 * @param params
 */
const addTransactionItem = (params: BaseParams<ITransactionRecord>) => {
  useStore.setState((state) => {
    const newRecord = createRecord({
      level: 1,
      ...params,
    });
    return { transaction: merge(state.transaction, newRecord) };
  });
};

const removeWatchList = (code: string) => {
  useStore.setState((state) => {
    return { watchList: state.watchList.filter((item) => item.code !== code) };
  });
};

const insertWatchList = (params: Pick<IWatchList, "code" | "name" | "type">) => {
  console.log("insertWatchList", params);
  useStore.setState((state) => ({
    watchList: [
      ...state.watchList,
      {
        ...params,
        id: params.code,
        create_at: Date.now().toString(),
        update_at: Date.now().toString(),
      },
    ],
  }));
};

const insertStrategy = (params: IStrategyConfig) => {
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

const updateStrategy = (params: IStrategyConfig) => {
  useStore.setState((state) => ({
    presetList: state.presetList.map((item) => (item.id === params.id ? params : item)),
  }));
};

const insertTransaction = (params: BaseParams<ITradRecord>) => {
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

const updateTransaction = (params: BaseParams<ITradRecord>) => {
  useStore.setState((state) => ({
    transaction: state.transaction.map((item) => (item.id === params.id ? { ...item, ...params } : item)),
  }));
};

const removeTransaction = (id: string) => {
  useStore.setState((state) => ({
    transaction: state.transaction.filter((item) => item.id !== id),
  }));
};

const useFilteredTransaction = (code: string) => {
  const record = Store.use.transaction();
  return useMemo(() => record.filter((item) => item.code === code), [record, code]);
};

const useStoreData = () => {
  return useStore.getState();
};

export const strategyAction = {
  insertStrategy,
  updateStrategy,
};

export const transactionAction = {
  updateTransaction,
  insertTransaction,
  removeTransaction,
  useFilteredTransaction,
  addTransactionItem,
};

export const watchListAction = {
  insertWatchList,
  removeWatchList,
  useWatchList: Store.use.watchList,
};

export { generateGrid } from "./helper";
export { createRecord, createStrategy, useStoreData };
