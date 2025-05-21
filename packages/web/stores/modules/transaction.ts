import { createPersistStore, createSelectors } from "../core";

import type { TransactionRecord } from "../types/type.d";
import { createTransactionItem } from "../utils/transaction";
interface TransactionStore {
  transaction: TransactionRecord[];
  insert: (params: BaseParams<TransactionRecord>) => void;
  update: (params: TransactionRecord) => void;
  remove: (code: string) => void;
  init: (transaction: TransactionRecord[]) => void;
}

const transactionStore = createPersistStore<TransactionStore>(
  "transaction",
  {
    transaction: [],
  },
  (set) => ({
    transaction: [],
    insert: (params: BaseParams<TransactionRecord>) => {
      set((state) => ({ transaction: [...state.transaction, createTransactionItem(params)] }), undefined, "transaction/insert");
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

export { transactionStore, transactionStoreAction };
