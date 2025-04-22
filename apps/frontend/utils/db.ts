import "./env-config.ts";

import DataBase from "@etf-visualizer/database";
import { logger } from "@etf-visualizer/shared";

const { DB_HOST, DB_USER, DB_NAME } = process.env;

if (![DB_HOST, DB_USER, DB_NAME].every((i) => i !== undefined)) {
  throw new Error("Database environment variables are not set");
}

const db = new DataBase(
  {
    host: process.env.DB_HOST!,
    user: process.env.DB_USER!,
    password: process.env.DB_PASSWORD!,
    database: process.env.DB_NAME!,
  },
  logger
);

export default db;
