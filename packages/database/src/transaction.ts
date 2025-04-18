import pool from "./init.ts";
import { logger } from "@etf-visualizer/shared";
import type { Transaction } from "./types.d.ts";

/**
/**
 * @description 插入或更新主理人交易记录
 * @param transactions
 * @returns
 */
export async function insertOrUpdateHostTransaction(transactions: Transaction[]) {
  try {
    const sql = `
      INSERT INTO transactions (id, code, timestamp, type, price, volume, profit, profit_rate, is_host)
      VALUES ?
      ON DUPLICATE KEY UPDATE 
        code = VALUES(code),
        timestamp = VALUES(timestamp),
        type = VALUES(type),
        price = VALUES(price),
        volume = VALUES(volume),
        profit = VALUES(profit),
        profit_rate = VALUES(profit_rate),
        is_host = 1
        `;
    const data = [
      transactions.map((transaction) => [
        transaction.id,
        transaction.code,
        transaction.timestamp,
        transaction.type,
        transaction.price,
        transaction.volume,
        transaction.profit,
        transaction.profit_rate,
        1,
      ]),
    ];

    const [result] = await pool.query(sql, data);

    logger.info("插入交易数据成功", { result });
    return true;
  } catch (error) {
    logger.error("插入交易数据失败", { error });
    throw new Error("插入交易数据失败");
  }
}

/**
 * @description 查询交易数据
 * @param code
 * @returns
 */
export async function queryTransaction(code?: string) {
  try {
    const select = "SELECT id, code, timestamp, type, price, volume FROM transactions ";
    const sql = code ? `${select} WHERE is_host = 0 AND code = ?` : select;
    const [result] = await pool.query(sql, [code]);
    return result as Transaction[];
  } catch (error) {
    logger.error("查询交易数据失败", { error });
    throw error;
  }
}

/**
 * @description 查询主理人交易数据
 */
export async function queryTransactionHost(code?: string) {
  try {
    const sql = `SELECT id, code, timestamp, type, price, volume FROM transactions WHERE is_host = 1 AND code = ?`;
    const [result] = await pool.query(sql, [code]);
    return result as Transaction[];
  } catch (error) {
    logger.error("查询主理人交易数据失败", { error });
    throw error;
  }
}

/**
 * @description 插入或更新交易数据
 * @param transactions
 * @returns
 */
export async function insertOrUpdateTransaction(transactions: Transaction[]) {
  try {
    const sql = `
      INSERT INTO transactions (id, code, timestamp, type, price, volume, profit, profit_rate)
      VALUES ?
      ON DUPLICATE KEY UPDATE 
        code = VALUES(code),
        timestamp = VALUES(timestamp),
        type = VALUES(type),
        price = VALUES(price),
        volume = VALUES(volume),
        profit = VALUES(profit),
        profit_rate = VALUES(profit_rate)
    `;
    const data = transactions.map((transaction) => [
      transaction.id,
      transaction.code,
      transaction.timestamp,
      transaction.type,
      transaction.price,
      transaction.volume,
      transaction.profit,
      transaction.profit_rate,
    ]);
    const [result] = await pool.query(sql, [data]);
    return result;
  } catch (error) {
    logger.error("更新交易数据失败", { error });
    throw error;
  }
}

/**
 * @description 删除交易数据
 * @param ids
 * @returns
 */
export async function deleteTransaction(ids: (number | string)[]) {
  try {
    const sql = `DELETE FROM transactions WHERE id IN (?)`;
    const [result] = await pool.query(sql, [ids]);
    return result;
  } catch (error) {
    logger.error("删除交易数据失败", { error });
    throw error;
  }
}
