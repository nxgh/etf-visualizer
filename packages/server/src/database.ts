import mysql from "mysql2/promise";

export const pool = mysql.createPool({
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

export const insertSync = async (userId: string, clientId: string, data: any) => {
  const [result] = await pool.execute(
    "INSERT INTO sync (user_id, client_id, data, updated_at) VALUES (?, ?, ?, NOW())",
    [userId, clientId, JSON.stringify(data)],
  );
  return result;
};

export const findSync = async (userId: string, clientId: string) => {
  const [result] = await pool.execute<mysql.RowDataPacket[]>(
    "SELECT * FROM sync WHERE user_id = ? AND client_id = ? ORDER BY updated_at DESC LIMIT 1",
    [userId, clientId],
  );
  return result[0];
};

export const getSyncCount = async (userId: string, clientId: string) => {
  const [result] = await pool.execute<mysql.RowDataPacket[]>(
    "SELECT COUNT(*) as count FROM sync WHERE user_id = ? AND client_id = ?",
    [userId, clientId],
  );
  return result[0].count;
};

export const updateOldestSync = async (userId: string, clientId: string, data: any) => {
  const [result] = await pool.execute(
    "UPDATE sync SET data = ?, updated_at = NOW() WHERE user_id = ? AND client_id = ? ORDER BY updated_at ASC LIMIT 1",
    [JSON.stringify(data), userId, clientId],
  );
  return result;
};
