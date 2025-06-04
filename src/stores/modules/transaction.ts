import { pick } from "lodash-es";
import { createPersistStore, createSelectors } from "../core";

import type { TransactionRecord } from "../types/type.d";
import { createTransactionItem } from "../utils/transaction";
interface TransactionStore {
  transaction: TransactionRecord[];
  insert: (params: Partial<TransactionRecord>) => void;
  update: (params: TransactionRecord) => void;
  remove: (code: string) => void;
  init: (transaction: TransactionRecord[]) => void;
}

const transactionStore = createPersistStore<TransactionStore>(
  "transaction",
  {
    transaction: [],
  },
  (set, get) => ({
    transaction: [],
    insert: (params: Partial<TransactionRecord>) => {
      const list = get().transaction;

      const findItem = list.find((item) => {
        const keys = ["code", "date", "price", "quantity"] as const;
        return keys.every((key) => item[key] === params[key]);
      });
      if (findItem) {
        throw new Error(`${params.code} 在 ${params.date} 已存在`);
      }

      const newItem = createTransactionItem(params);

      set((state) => ({ transaction: [...state.transaction, newItem] }), undefined, "transaction/insert");
    },
    update: (params: Partial<TransactionRecord>) => {
      set(
        (state) => ({
          ...state,
          transaction: state.transaction.map((item) =>
            item.id === params.id
              ? {
                  ...item,
                  ...params,
                }
              : item
          ),
        }),
        undefined,
        "transaction/update"
      );
    },
    remove: (id: string) => {
      set(
        (state) => ({
          transaction: state.transaction.filter((item) => item.id !== id),
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

// export const insertTransaction = (params: TransactionRecord) => {
//   transactionStore.setState((state) => ({
//     transaction: [...state.transaction, params],
//   }));
// };

// export const removeTransaction = (code: string) => {
//   transactionStore.setState((state) => ({
//     transaction: state.transaction.filter((item) => item.id !== code),
//   }));
// };

const transactionStoreAction = createSelectors(transactionStore);

export const useInsertTransaction = () => {
  const transaction = transactionStoreAction.use.transaction();
  const insert = transactionStoreAction.use.insert();

  return (params: Partial<TransactionRecord>) => {
    // insert(params);
    // 1. 时间 + Code 唯一
    //
    if (params.date && params.code) {
      const findItem = transaction.find((item) => item.date === params.date && item.code === params.code);
      if (findItem) {
        throw new Error("已存在");
      }
    }
  };
};

export { transactionStore, transactionStoreAction };
