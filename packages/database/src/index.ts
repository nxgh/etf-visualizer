import "dotenv/config";

import mysql from "mysql2/promise";

import type {
  QueryStockHistoryParams,
  QueryStockHistoryResult,
  QuerySecurityDetailResult,
  Transaction,
  Logger,
  DatabaseConfig,
} from "./types.d.ts";

const defaultConfig: DatabaseConfig = {
  host: process.env.DB_HOST!,
  user: process.env.DB_USER!,
  password: process.env.DB_PASSWORD!,
  database: process.env.DB_NAME!,
  waitForConnections: true,
  connectionLimit: 10,
  maxIdle: 10,
  idleTimeout: 60000,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
};

class Database {
  private pool: mysql.Pool;
  private logger: Logger;
  constructor(config: DatabaseConfig = defaultConfig, logger: Logger) {
    this.pool = mysql.createPool({
      host: config.host,
      user: config.user,
      password: config.password,
      database: config.database,
      waitForConnections: config.waitForConnections,
      connectionLimit: config.connectionLimit,
      maxIdle: config.maxIdle,
      idleTimeout: config.idleTimeout,
      queueLimit: config.queueLimit,
      enableKeepAlive: config.enableKeepAlive,
      keepAliveInitialDelay: config.keepAliveInitialDelay,
    });
    this.logger = logger;
  }

  async query(sql: string, params: any[]) {
    const [results] = await this.pool.query(sql, params);
    return results;
  }

  /**
   * @description 查询历史数据
   * @param params
   * @returns
   */
  async queryFinancialHistory({ code, begin, end }: { code: string; begin: Date; end: Date }) {
    const sql = `
SELECT * FROM financial_history
WHERE code = ?
AND timestamp between ? and ?;
`;
    try {
      const [results] = await this.pool.query(sql, [code, begin, end]);

      return results as QueryStockHistoryResult[];
    } catch (error) {
      this.logger.error("查询历史数据失败", { error });
      return [];
    }
  }

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
  async insertFinancialHistory(params: QueryStockHistoryParams[]) {
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

      const [results] = await this.pool.query(sql, [data]);

      return results;
    } catch (error) {
      this.logger.error("插入历史数据失败", { error, sql, params });
      return [];
    }
  }

  /**
   * @description 查询历史数据数量
   * @param code
   * @returns
   */
  async queryStockHistoryCount(code: string) {
    const sql = `
    SELECT COUNT(*) FROM financial_history
    WHERE code = ?;
`;
    try {
      const [results] = await this.pool.query(sql, [code]);

      return (results as { "COUNT(*)": number }[])[0]["COUNT(*)"];
    } catch (error) {
      this.logger.error("查询历史数据数量失败", { error });
      return 0;
    }
  }

  /**
   * @description 查询最新历史数据
   * @param code
   * @returns
   */
  async queryLastStockHistory(code: string) {
    try {
      const sql = `
    SELECT * FROM financial_history WHERE code = ? ORDER BY timestamp DESC LIMIT 1;
  `;
      const [results] = await this.pool.query(sql, [code]);

      this.logger.info("查询最新历史数据成功", { results });
      return (results as QueryStockHistoryResult[])[0];
    } catch (error) {
      this.logger.error("查询最新历史数据失败", { error });
      return null;
    }
  }

  /**
   * @description 查询证券详情
   * @param code
   * @returns
   */
  querySecurityDetail = async (code: string) => {
    try {
      const sql = `
      SELECT code, name, issue_date, is_favorite FROM security WHERE code = ?;
    `;
      const [results] = await this.pool.query(sql, [code]);

      return (results as QuerySecurityDetailResult[])?.[0];
    } catch (error) {
      this.logger.error("查询证券详情失败", { error });
      return null;
    }
  };

  /**
   * @description 插入证券详情数据
   * @param data
   */
  async insertSecurityDetail(data: { code: string; name: string; issue_date: Date }) {
    try {
      const sql = `INSERT INTO security (code, name, issue_date) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE name = VALUES(name), issue_date = VALUES(issue_date)`;
      await this.pool.query(sql, [data.code, data.name, data.issue_date]);

      this.logger.info("插入股票详情数据成功", { data });
    } catch (error) {
      this.logger.error("插入证券详情数据失败", { error });
    }
  }

  /**
   * @description 更新证券自选
   */
  async insertSecurityFavorite(code: string, name: string) {
    this.logger.info("insertSecurityFavorite", { code, name });
    try {
      const sql = `INSERT INTO security (code, name, is_favorite) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE name = VALUES(name), is_favorite = VALUES(is_favorite)`;
      const [result] = await this.pool.execute(sql, [code, name, true]);

      this.logger.info("insertSecurityFavorite", { code, name, result });
      return result;
    } catch (error) {
      this.logger.error("插入证券自选失败", { error });
      return null;
    }
  }

  /**
   * @description 更新证券自选状态
   */
  async updateSecurityFavorite(code: string, favorite: boolean) {
    try {
      const sql = `UPDATE security SET is_favorite = ? WHERE code = ?`;
      const [result] = await this.pool.execute(sql, [favorite, code]);

      return result;
    } catch (error) {
      this.logger.error("更新证券自选状态失败", { error });
      return null;
    }
  }

  /**
   * @description 查询证券自选状态
   * @returns
   */
  querySecurityFavorite = async () => {
    try {
      const sql = `SELECT code, name, issue_date, is_favorite FROM security WHERE is_favorite = 1`;
      const [results] = await this.pool.query(sql);

      return results as {
        code: string;
        name: string;
        issue_date: Date;
        is_favorite: boolean;
      }[];
    } catch (error) {
      this.logger.error("查询证券自选状态失败", { error });
      return [];
    }
  };

  /**
/**
 * @description 插入或更新主理人交易记录
 * @param transactions
 * @returns
 */
  async insertOrUpdateHostTransaction(transactions: Transaction[]) {
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

      const [result] = await this.pool.query(sql, data);

      this.logger.info("插入交易数据成功", { result });
      return true;
    } catch (error) {
      this.logger.error("插入交易数据失败", { error });
      throw new Error("插入交易数据失败");
    }
  }

  /**
   * @description 查询交易数据
   * @param code
   * @returns
   */
  async queryTransaction(code?: string) {
    try {
      const sql = "SELECT id, code, timestamp, type, price, volume, profit, profit_rate, is_host FROM transactions WHERE code = ?";
      const [result] = await this.pool.query(sql, [code]);
      return result as Transaction[];
    } catch (error) {
      this.logger.error("查询交易数据失败", { error });
      throw error;
    }
  }

  /**
   * @description 插入或更新交易数据
   * @param transactions
   * @returns
   */
  async insertOrUpdateTransaction(transactions: Transaction[]) {
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
      const [result] = await this.pool.query(sql, [data]);
      return result;
    } catch (error) {
      this.logger.error("更新交易数据失败", { error });
      throw error;
    }
  }

  /**
   * @description 删除交易数据
   * @param ids
   * @returns
   */
  async deleteTransaction(ids: (number | string)[]) {
    try {
      const sql = `DELETE FROM transactions WHERE id IN (?)`;
      const [result] = await this.pool.query(sql, [ids]);
      return result;
    } catch (error) {
      this.logger.error("删除交易数据失败", { error });
      throw error;
    }
  }
}

export default Database;

export type {
  QueryStockHistoryParams,
  QueryStockHistoryResult,
  QuerySecurityDetailResult,
  Transaction,
  Logger,
  DatabaseConfig,
};
