import { logger } from "@etf-visualizer/logger";
import mysql from "mysql2/promise";

const pool = mysql.createPool({
  host: process.env.DB_HOST!,
  port: Number(process.env.DB_PORT!),
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
});

// export default pool;

// 数据库类
export interface IPost {
  id: string;
  user_id: string;
  pic_ids: string;
  text: string;
  time: string;
  link: string;
  ref_link: string;
  ref_text: string;
}

export const insertPost = async (value: IPost & { imgs?: Array<string> }) => {
  try {
    const [result] = await pool.query(
      `
    INSERT INTO weibo_posts 
        (post_id, user_id, text, time, ref_text, ref_link, pic_ids) 
    VALUES 
        (?, ?, ?, ?, ?, ?, ?)
    `,
      [value.id, value.user_id, value.text, value.time, value.ref_text, value.ref_link, JSON.stringify(value.pic_ids)]
    );

    logger.info("+插入微博成功", { result });

    return result;
  } catch (error) {
    logger.error("x插入微博失败", { error });
    throw error;
  }
};

export const findPostById = async (id: string) => {
  try {
    const [result] = await pool.query(`SELECT * FROM weibo_posts WHERE post_id = ?`, [id]);
    logger.info("findPostById success", { result });
    return (result as any)?.[0];
  } catch (error) {
    logger.error("findPostById error", { error });
    throw error;
  }
};
