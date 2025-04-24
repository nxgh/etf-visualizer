import { storage } from "#store";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import dayjs from "dayjs";
export const TransactionTypeMap = {
  buy: "buy",
  sell: "sell",
} as const;

export interface TransactionType {
  id: number;
  timestamp: string;
  price: number | "";
  volume: number | "";
  amount?: number | "";
  profit: number | "";
  profit_rate: number | "";
  remark: string;
  level: number | "";
  type?: typeof TransactionTypeMap.buy | typeof TransactionTypeMap.sell;
  createAt: number;
}

export const getRowData = (): TransactionType => ({
  timestamp: dayjs().format("YYYY-MM-DD"),
  price: "",
  volume: "",
  amount: "",
  remark: "",
  profit: "",
  profit_rate: "",
  id: Date.now(),
  createAt: Date.now(),
  level: "",
});

interface TransactionState {
  transactions: TransactionType[];
  insertTransactions: (transactions: TransactionType[]) => void;
  insertTransaction: () => void;
  updateTransaction: (transaction: TransactionType) => void;
  removeTransaction: (transaction: TransactionType) => void;
}

export const useTransactionStore = create<TransactionState>()(
  persist(
    (set, get) => ({
      transactions: [],
      insertTransactions: (transactions: TransactionType[]) => {
        set({ transactions });
      },
      insertTransaction: () => {
        set({ transactions: [...get().transactions, getRowData()] });
      },
      updateTransaction: (transaction: TransactionType) => {
        set({ transactions: get().transactions.map((t) => (t.id === transaction.id ? transaction : t)) });
      },
      removeTransaction: (transaction: TransactionType) => {
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
