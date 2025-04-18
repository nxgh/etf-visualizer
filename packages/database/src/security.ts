import pool from "./init.ts";
import { logger } from "@etf-visualizer/shared";

import type { QueryStockDetailResult } from "./types.d.ts";

/**
 * @description 查询股票详情
 * @param code
 * @returns
 */
export const queryStockDetail = async (code: string) => {
  try {
    const sql = `
      SELECT code, name, issue_date, is_favorite FROM security WHERE code = ?;
    `;
    const [results] = await pool.query(sql, [code]);

    logger.info("查询股票详情成功", { sql, code, results });
    return (results as QueryStockDetailResult[])?.[0];
  } catch (error) {
    logger.error("查询股票详情失败", { error });
    return null;
  }
};

/**
 * @description 插入股票详情数据
 * @param data
 */
export async function insertStockDetail(data: { code: string; name: string; issue_date: Date }) {
  try {
    const sql = `INSERT INTO security (code, name, issue_date) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE name = VALUES(name), issue_date = VALUES(issue_date)`;
    await pool.query(sql, [data.code, data.name, data.issue_date]);

    logger.info("插入股票详情数据成功", { data });
  } catch (error) {
    logger.error("插入股票详情数据失败", { error });
  }
}

/**
 * @description 更新股票收藏状态
 */
export async function updateSecurityFavorite(code: string, favorite: boolean) {
  try {
    const sql = `UPDATE security SET is_favorite = ? WHERE code = ?`;
    const [result] = await pool.execute(sql, [favorite, code]);

    return result;
  } catch (error) {
    logger.error("更新股票收藏状态失败", { error });
    return null;
  }
}

/**
 * @description 查询股票收藏状态
 * @returns
 */
export const queryStockFavorite = async () => {
  try {
    const sql = `SELECT code, name, issue_date, is_favorite FROM security WHERE is_favorite = 1`;
    const [results] = await pool.query(sql);

    return results as {
      code: string;
      name: string;
      issue_date: Date;
      is_favorite: boolean;
    }[];
  } catch (error) {
    logger.error("查询股票收藏状态失败", { error });
    return [];
  }
};
