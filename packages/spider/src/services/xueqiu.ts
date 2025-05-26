import type { ChartKlineJSON } from "#/site/xueqiu/chart-kline.js";
import {
  findSecurityBySymbol,
  findSecurityHistoryBySymbol,
  type SecurityInfo,
  insertOrUpdateSecurityHistory,
  insertOrUpdateSecurity,
} from "#/utils/database.ts";

import dayjs from "dayjs";
import * as XueQiu from "#/site/xueqiu/index.ts";
import type { Logger } from "#/utils/logger.ts";

export async function fetchStockDetailAndKline(symbol: string) {
  // 查询 db 是否存在 symbol 数据
  try {
    const shouldUpdate = await shouldUpdateSecurity(symbol);

    // 如果不需要更新，返回缓存数据
    if (!shouldUpdate) {
      const securityInfo = await findSecurityBySymbol(symbol);
      const securityHistory = await findSecurityHistoryBySymbol(symbol);
      if (securityInfo) {
        return {
          detail: {
            quote: {
              symbol: securityInfo.symbol,
              exchange: securityInfo.exchange,
              code: securityInfo.code,
              issue_date: securityInfo.issue_date,
            },
          },
          kline: securityHistory,
        };
      }
    }

    // 不存在或需要更新，查询详情获取 issue_date，查询 kline 获取 begin 和 end
    const detail = await XueQiu.fetchStockDetail(symbol);
    const { issue_date, exchange, symbol: symbol_xq, code } = detail.quote;

    let begin = dayjs(issue_date).valueOf();
    const end = dayjs().valueOf();

    if (typeof shouldUpdate !== "boolean") {
      begin = shouldUpdate.valueOf();
    }

    const kline = await XueQiu.fetchStockKline({
      symbol: symbol_xq,
      begin,
      end,
    });

    // 更新数据库
    const securityInfo: SecurityInfo = {
      symbol: symbol_xq,
      exchange,
      code,
      issue_date: new Date(issue_date),
    };
    await insertOrUpdateSecurity(securityInfo);

    await insertOrUpdateSecurityHistory(symbol_xq, formatKline(kline));

    return { detail, kline };
  } catch (error) {
    throw error;
  }
}

async function shouldUpdateSecurity(symbol: string): Promise<boolean | dayjs.Dayjs> {
  try {
    const security = await findSecurityBySymbol(symbol);

    const kline = await findSecurityHistoryBySymbol(symbol);
    // 如果不存在数据，需要更新
    if (!security || !kline?.rows.length) return true;

    const now = dayjs();
    const updatedAt = dayjs(security.updated_at);

    // 判断是否为同一天
    if (!updatedAt.isSame(now, "day") && now.diff(updatedAt, "hour") > 24) return updatedAt;

    // 判断更新时间是否小于 15:00:00
    if (updatedAt.hour() < 15) {
      // 如果当前时间大于 15:00:00 则需要更新
      if (now.hour() >= 15) return updatedAt;
    }

    // 不需要更新
    return false;
  } catch (error) {
    // 出错时默认需要更新
    return true;
  }
}

function formatKline(kline: ChartKlineJSON) {
  return kline.data.item.map((i) => ({
    timestamp: i[0],
    volume: i[1],
    open: i[2],
    high: i[3],
    low: i[4],
    close: i[5],
  }));
}

class XueQiuService {
  private logger: Logger;
  constructor(logger: Logger) {
    this.logger = logger;
  }
  async searchByKeyword(keyword: string) {
    try {
      const res = await XueQiu.searchByKeyword(keyword);
      return res;
    } catch (error) {
      this.logger.error("搜索失败", { error });
      return [];
    }
  }
  async fetchStockKline(symbol: string, begin: string, end: string) {
    try {
      const res = await XueQiu.fetchStockKline({ symbol, begin, end });
      return res;
    } catch (error) {
      this.logger.error("获取K线失败", { error });
      return [];
    }
  }
  async fetchStockDetail(symbol: string) {
    try {
      const res = await XueQiu.fetchStockDetail(symbol);
      return res;
    } catch (error) {
      this.logger.error("获取详情失败", { error });
      return null;
    }
  }
  async fetchStockDetailAndKline(symbol: string) {
    try {
      const res = await this.fetchStockDetail(symbol);
      const kline = await this.fetchStockKline(symbol, String(res?.quote.issue_date), String(dayjs().valueOf()));
      return { detail: res, kline };
    } catch (error) {
      this.logger.error("获取详情和K线失败", { error });
      return null;
    }
  }
}

export default XueQiuService;
