import type { BaseParams, TransactionRecord } from "#stores/types/type.d";
import { withTimestamp } from "./helper";

/**
 * 创建网格交易记录
 */
export function createTransactionItem(params: Partial<TransactionRecord>): TransactionRecord {
  const defaultConfig: TransactionRecord = withTimestamp({
    id: Date.now().toString(),
    date: new Date().toISOString(),
    code: "",
    price: 0,
    quantity: 0,
    source: "",
    category: "",
    remark: "",
    fee: 0,
  });

  return {
    ...defaultConfig,
    ...params,
  };
}
