import 'dotenv/config'

import { logger } from '@etf-visualizer/shared'
import Database from '@etf-visualizer/database'

const db = new Database(
  {
    host: process.env.DB_HOST!,
    user: process.env.DB_USER!,
    password: process.env.DB_PASSWORD!,
    database: process.env.DB_NAME!,
  },
  logger
)

export default db
