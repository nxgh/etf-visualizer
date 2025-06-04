import { useShallow } from "zustand/shallow";
import { createPersistStore, createSelectors } from "../core";

interface SecurityTypeStore {
  securityType: { id: number; en_name: string; name: string }[];
}

const stockTypeMap = [
  { id: 0, en_name: "other", name: "其他类型" },
  { id: 6, en_name: "us_adr", name: "美股ADR" },
  { id: 11, en_name: "a_share", name: "A股普通股票" },
  { id: 12, en_name: "index", name: "指数" },
  { id: 13, en_name: "etf", name: "ETF基金" },
  { id: 23, en_name: "index_fund", name: "指数基金/联接基金" },
  { id: 26, en_name: "csi_index", name: "中证系列指数" },
  { id: 30, en_name: "hk_stock", name: "港股" },
  { id: 31, en_name: "hk_index", name: "港股指数" },
  { id: 35, en_name: "concept", name: "概念板块" },
  { id: 81, en_name: "industry", name: "行业板块" },
];

const securityTypeStore = createPersistStore<SecurityTypeStore>(
  "securityType",
  {
    securityType: [],
  },
  (set, get) => ({
    securityType: [],
  })
);

const securityTypeStoreAction = createSelectors(securityTypeStore);

export const initSecurityType = () => {
  securityTypeStore.setState({
    securityType: stockTypeMap,
  });
};

export { securityTypeStore, securityTypeStoreAction };
