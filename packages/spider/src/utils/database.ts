import type { BlogParsed } from "#/site/weibo/types/type.js";
import { defaultLogger as logger } from "../utils/logger.ts";
import dayjs from "dayjs";
import mysql from "mysql2/promise";

export interface WeiboUser {
  user_id: number;
  user_name: string;
  user_avatar: string;
  user_description: string;
  user_created_at: string;
  first_blog_id?: string;
}

export interface SecurityInfo {
  symbol: string;
  exchange: string;
  code: string;
  issue_date: Date;
  kline?: Record<string, unknown> | null;
  created_at?: Date;
  updated_at?: Date;
}

export interface SecurityHistory {
  symbol: string;
  timestamp: Date;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  created_at?: Date;
  updated_at?: Date;
}
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,

  waitForConnections: true,
  connectionLimit: 10,
  maxIdle: 10,
  idleTimeout: 60000,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
});

export const insertPost = async (list: BlogParsed[]) => {
  try {
    const values = list.map((item) => [
      item.id,
      item.blog_id,
      item.user_id,
      JSON.stringify(item.pic_ids),
      item.text?.substring(0, 1000) || "",
      dayjs(item.time).toDate(),
      item.ref_link || "",
      item.ref_text?.substring(0, 1000) || "",
    ]);

    if (values.length === 0) {
      logger.info("没有数据需要插入");
      return true;
    }

    const [result] = await pool.query(
      "INSERT IGNORE INTO weibo_posts (id, blog_id, user_id, pic_ids, text, time, ref_link, ref_text) VALUES ?",
      [values],
    );

    logger.info("插入帖子成功", { result });
    return true;
  } catch (error) {
    logger.error("插入帖子失败", { error, values: list.map((i) => i.id) });
    throw error;
  }
};

export const findPostById = async (id: string) => {
  try {
    const [rows] = await pool.execute<mysql.RowDataPacket[]>("SELECT * FROM weibo_posts WHERE id = ? LIMIT 1", [id]);
    return (rows[0] as BlogParsed) || null;
  } catch (error) {
    logger.error("查询帖子失败", { error });
    return null;
  }
};

export const findLatestPostByUserId = async (userId: string) => {
  try {
    const [rows] = await pool.execute<mysql.RowDataPacket[]>(
      "SELECT * FROM weibo_posts WHERE user_id = ? ORDER BY time DESC LIMIT 1",
      [userId],
    );
    return rows[0] as BlogParsed;
  } catch (error) {
    logger.error("查询最新博文失败", { error });
    return null;
  }
};

export const findUserById = async (uid: number | string): Promise<WeiboUser | null> => {
  try {
    const [rows] = await pool.execute<mysql.RowDataPacket[]>(
      "SELECT user_id, user_name, user_avatar, user_description, user_created_at, first_blog_id FROM weibo_users WHERE user_id = ?",
      [uid],
    );
    return (rows[0] as WeiboUser) || null;
  } catch (error) {
    logger.error("查询用户失败", { error });
    return null;
  }
};

export const insertUser = async (user: WeiboUser) => {
  const userInfo = {
    id: user.user_id,
    name: user.user_name,
    avatar: user.user_avatar,
    description: user.user_description,
    created_at: user.user_created_at,
  };

  try {
    const [result] = await pool.execute(
      "INSERT INTO weibo_users (user_id, user_name, user_avatar, user_description, user_created_at) VALUES (?, ?, ?, ?, ?)",
      [user.user_id, user.user_name, user.user_avatar, user.user_description, new Date(user.user_created_at)],
    );
    logger.info("插入用户成功", { result });
    return userInfo;
  } catch (error) {
    logger.error("插入用户失败", { error });
  }

  return null;
};

export const updateUserFirstBlogId = async (userId: string | number, firstBlogId: string) => {
  try {
    const [result] = await pool.execute(
      "UPDATE weibo_users SET first_blog_id = ? WHERE user_id = ? AND first_blog_id IS NULL",
      [firstBlogId, userId],
    );
    logger.info("更新用户第一条博文ID成功", { result });
    return true;
  } catch (error) {
    logger.error("更新用户第一条博文ID失败", { error });
    throw error;
  }
};

export const checkPostExists = async (blogIds: string[]): Promise<string[]> => {
  try {
    if (!blogIds.length) return [];
    const [rows] = await pool.query("SELECT blog_id FROM weibo_posts WHERE blog_id IN (?)", [blogIds]);
    return (rows as mysql.RowDataPacket[]).map((row) => row.blog_id);
  } catch (error) {
    logger.error("检查博文是否存在失败", { error });
    throw error;
  }
};

export const findSecurityHistoryBySymbol = async (
  symbol: string,
): Promise<{ columns: string[]; rows: (number | string)[][] } | null> => {
  try {
    const [rows] = await pool.execute<mysql.RowDataPacket[]>("SELECT * FROM security_history WHERE symbol = ?", [
      symbol,
    ]);
    return {
      columns: Object.keys(rows[0]),
      rows: rows.map((row) => Object.values(row)),
    };
  } catch (error) {
    logger.error("查询证券历史数据失败", { error, symbol });
    return null;
  }
};

export const findSecurityBySymbol = async (symbol: string): Promise<SecurityInfo | null> => {
  try {
    const [rows] = await pool.execute<mysql.RowDataPacket[]>(
      "SELECT symbol, exchange, code, issue_date, created_at, updated_at FROM security_info WHERE symbol = ? LIMIT 1",
      [symbol],
    );

    if (!rows.length) return null;

    const row = rows[0] as mysql.RowDataPacket;

    return row as SecurityInfo;
  } catch (error) {
    logger.error("查询证券信息失败", { error, symbol });
    return null;
  }
};

export const insertOrUpdateSecurity = async (security: SecurityInfo) => {
  try {
    const [result] = await pool.execute(
      `INSERT INTO security_info (symbol, exchange, code, issue_date) 
       VALUES (?, ?, ?, ?) 
       ON DUPLICATE KEY UPDATE 
       exchange = VALUES(exchange), 
       code = VALUES(code), 
       issue_date = VALUES(issue_date)`,
      [security.symbol, security.exchange, security.code, security.issue_date],
    );

    logger.info("插入或更新证券信息成功", { symbol: security.symbol });
    return true;
  } catch (error) {
    logger.error("插入或更新证券信息失败", { error, symbol: security.symbol });
    throw error;
  }
};

export const insertOrUpdateSecurityHistory = async (
  symbol: string,
  securityHistory: {
    timestamp: number;
    open: number;
    high: number;
    low: number;
    close: number;
    volume: number;
  }[],
) => {
  try {
    if (!securityHistory.length) return true;

    const [result] = await pool.query(
      `INSERT INTO security_history (symbol, timestamp, open, high, low, close, volume) VALUES ? 
       ON DUPLICATE KEY UPDATE open = VALUES(open), high = VALUES(high), 
       low = VALUES(low), close = VALUES(close), volume = VALUES(volume)`,
      [
        securityHistory.map((item) => [
          String(symbol),
          dayjs(item.timestamp).toDate(),
          item.open,
          item.high,
          item.low,
          item.close,
          item.volume,
        ]),
      ],
    );
    logger.info("插入或更新证券历史数据成功", { symbol, length: securityHistory.length });
    return true;
  } catch (error) {
    logger.error("插入或更新证券历史数据失败", { error, symbol });
    throw error;
  }
};

export const findSecurityHistoryBySymbolAndDate = async (symbol: string, begin: string, end: string) => {
  try {
    const [rows] = await pool.execute<mysql.RowDataPacket[]>(
      "SELECT * FROM security_history WHERE symbol = ? AND timestamp BETWEEN ? AND ?",
      [symbol, dayjs(begin).toDate(), dayjs(end).toDate()],
    );
    return rows as SecurityHistory[];
  } catch (error) {
    logger.error("查询证券历史数据失败", { error, symbol, begin, end });
    return null;
  }
};
