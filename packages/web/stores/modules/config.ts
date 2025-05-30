import { useShallow } from "zustand/shallow";
import { createPersistStore, createSelectors } from "../core";

export const dataType = [
  { label: "字符串 String", value: "string" },
  { label: "数字 Number", value: "number" },
  { label: "布尔 Boolean", value: "boolean" },
  { label: "数组 Array", value: "array" },
  { label: "对象 Object", value: "object" },
  { label: "日期 Date", value: "date" },
  { label: "浮点 Float", value: "float" },
  { label: "大整数 BigInt", value: "bigint" },
] as const;

export type DataType = (typeof dataType)[number]["value"];

export type TableId = `T${string}`;
export type ColumnId = `C${string}`;

export interface TableConfig {
  tableName: string;
  desc: string;
  id: TableId;
  columns: ColumnId[];
}

export interface ColumnConfig {
  id: ColumnId;
  label: string;
  key: string;
  desc: string;
  type: DataType;
}

interface ConfigStore {
  tableConfig: TableConfig[];
  columnConfig: ColumnConfig[];

  // createTableName: (name: string) => void;
}

const configStore = createPersistStore<ConfigStore>(
  "config",
  {
    tableConfig: [],
    columnConfig: [],
  },
  (set, get) => ({
    tableConfig: [],
    columnConfig: [],
  })
);

const configStoreAction = createSelectors(configStore);

export { configStore, configStoreAction };
