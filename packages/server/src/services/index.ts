import { findSync, getSyncCount, insertSync, updateOldestSync } from "../database.ts";
import { logger } from "@etf-visualizer/logger";

class SyncService {
  async sync(userId: string, clientId: string, data: Record<string, unknown>) {
    try {
      const count = await getSyncCount(userId, clientId);

      if (count < 10) {
        // 如果数据少于10条，直接插入新数据
        await insertSync(userId, clientId, data);
        logger.info("同步数据已插入", { userId, clientId });
      } else if (count === 10) {
        // 如果数据等于10条，更新最旧的数据
        await updateOldestSync(userId, clientId, data);
        logger.info("已更新最旧的同步数据", { userId, clientId });
      }

      return { success: true };
    } catch (error) {
      logger.error("同步数据失败", { error, userId, clientId });
      throw error;
    }
  }
}

const syncService = new SyncService();
export { SyncService, syncService };
