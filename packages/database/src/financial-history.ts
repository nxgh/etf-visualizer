import pool from "./init.ts";
import { logger } from "@etf-visualizer/shared";

import type { QueryStockHistoryParams, QueryStockHistoryResult } from "./types.d.ts";

/**
 * @description 查询历史数据
 * @param params
 * @returns
 */
export const queryFinancialHistory = async ({ code, begin, end }: { code: string; begin: Date; end: Date }) => {
  const sql = `
SELECT * FROM financial_history
WHERE code = ?
AND timestamp between ? and ?;
`;
  try {
    const [results] = await pool.query(sql, [code, begin, end]);

    return results as QueryStockHistoryResult[];
  } catch (error) {
    logger.error("查询历史数据失败", { error });
    return [];
  }
};

/**
 * @description 插入历史数据
 * @param data
 * @returns
 * @example
 * insertFinancialHistory([
 *   ["000001", "2025-04-14 06:14:27.000", 101, 991, 110, 100, 100],
 *   ["000002", "2025-04-14 06:14:30.000", 101, 991, 110, 100, 100],
 * ])
 */
export const insertFinancialHistory = async (params: QueryStockHistoryParams[]) => {
  const sql = `
  INSERT INTO financial_history (code, timestamp, volume, open, high, low, close) VALUES ?
  ON DUPLICATE KEY UPDATE 
    volume = VALUES(volume), 
    open = VALUES(open), 
    high = VALUES(high), 
    low = VALUES(low), 
    close = VALUES(close)
  `;
  try {
    const data = params.map((item) => [
      item.code,
      item.timestamp,
      item.volume,
      item.open,
      item.high,
      item.low,
      item.close,
    ]);

    const [results] = await pool.query(sql, [data]);

    return results;
  } catch (error) {
    logger.error("插入历史数据失败", { error, sql, params });
    return [];
  }
};

/**
 * @description 查询历史数据数量
 * @param code
 * @returns
 */
export const queryStockHistoryCount = async (code: string) => {
  const sql = `
    SELECT COUNT(*) FROM financial_history
    WHERE code = ?;
`;
  try {
    const [results] = await pool.query(sql, [code]);

    return (results as { "COUNT(*)": number }[])[0]["COUNT(*)"];
  } catch (error) {
    logger.error("查询历史数据数量失败", { error });
    return 0;
  }
};

/**
 * @description 查询最新历史数据
 * @param code
 * @returns
 */
export const queryLastStockHistory = async (code: string) => {
  try {
    const sql = `
    SELECT * FROM financial_history WHERE code = ? ORDER BY timestamp DESC LIMIT 1;
  `;
    const [results] = await pool.query(sql, [code]);

    logger.info("查询最新历史数据成功", { results });
    return (results as QueryStockHistoryResult[])[0];
  } catch (error) {
    logger.error("查询最新历史数据失败", { error });
    return null;
  }
};
