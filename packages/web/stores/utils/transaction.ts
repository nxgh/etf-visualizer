import type { BaseParams, TransactionRecord } from "#stores/types/type.d";
import { withTimestamp } from "./helper";

/**
 * 创建网格交易记录
 */
export function createTransactionItem(params: BaseParams<TransactionRecord>): TransactionRecord {
  const defaultConfig: TransactionRecord = withTimestamp({
    id: Date.now().toString(),
    level: 0,
    date: new Date().toISOString(),
    securityName: "",
    code: "",
    price: 0,
    quantity: 0,
    source: "",
  });

  return {
    ...defaultConfig,
    ...params,
  };
}
