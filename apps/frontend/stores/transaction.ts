import storage from "./idb-storage";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import dayjs from "dayjs";

import { createRecord, type IGridLevelRecord } from "./model";

interface TransactionState {
  transactions: IGridLevelRecord[];
  initTransactions: (transactions: IGridLevelRecord[]) => void;
  insertTransaction: () => void;
  updateTransaction: (transaction: IGridLevelRecord) => void;
  removeTransaction: (transaction: IGridLevelRecord) => void;
}

export const useTransactionStore = create<TransactionState>()(
  persist(
    (set, get) => ({
      transactions: [],
      initTransactions: (transactions: IGridLevelRecord[]) => {
        set({ transactions });
      },
      insertTransaction: () => {
        set({
          transactions: [
            ...get().transactions,
            createRecord({
              positionIndex: get().transactions.length + 1,
              level: 1,
            }),
          ],
        });
      },
      updateTransaction: (transaction: IGridLevelRecord) => {
        set({ transactions: get().transactions.map((t) => (t.id === transaction.id ? transaction : t)) });
      },
      removeTransaction: (transaction: IGridLevelRecord) => {
        set({ transactions: get().transactions.filter((t) => t.id !== transaction.id) });
      },
    }),
    {
      name: "transaction-storage",
      storage: createJSONStorage(() => storage),
    }
  )
);

export default useTransactionStore;
