import { createPersistStore, createSelectors } from "../core";

import type { TransactionRecord } from "../types/type.d";

interface TransactionStore {
  transaction: TransactionRecord[];
}

const transactionStore = createPersistStore<TransactionStore>(
  "transaction",
  {
    transaction: [],
  },
  (set) => ({
    transaction: [],
    insert: (params: TransactionRecord) => {
      set((state) => ({ transaction: [...state.transaction, params] }), undefined, "transaction/insert");
    },
    update: (params: TransactionRecord) => {
      set(
        (state) => ({
          ...state,
          transaction: state.transaction.map((item) => (item.id === params.id ? params : item)),
        }),
        undefined,
        "transaction/update"
      );
    },
    remove: (code: string) => {
      set(
        (state) => ({
          transaction: state.transaction.filter((item) => item.id !== code),
        }),
        undefined,
        "transaction/remove"
      );
    },

    init: (transaction: TransactionRecord[]) => {
      set((state) => ({ transaction }), undefined, "transaction/init");
    },
  })
);

export const insertTransaction = (params: TransactionRecord) => {
  transactionStore.setState((state) => ({
    transaction: [...state.transaction, params],
  }));
};

export const removeTransaction = (code: string) => {
  transactionStore.setState((state) => ({
    transaction: state.transaction.filter((item) => item.id !== code),
  }));
};

const transactionStoreAction = createSelectors(transactionStore);

export { transactionStore, transactionStoreAction };
