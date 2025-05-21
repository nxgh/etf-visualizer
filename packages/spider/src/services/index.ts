import WeiboSpider from "#/site/weibo/index.ts";
import type { BlogJSONType } from "#/site/weibo/types/blog.js";
import type { BlogParsed, GetBlogListByDateRangeParams } from "#/site/weibo/types/type.js";
import XueQiu from "#/site/xueqiu/index.ts";
import type { ChartKlineJSON } from "#/site/xueqiu/chart-kline.d.ts";
import {
  findUserById,
  insertUser,
  checkPostExists,
  updateUserFirstBlogId,
  insertPost,
  findPostById,
  findLatestPostByUserId,
  type WeiboUser,
  findSecurityBySymbol,
  insertOrUpdateSecurity as insertOrUpdateSecurityInfo,
  type SecurityInfo,
  insertOrUpdateSecurityHistory,
  findSecurityHistoryBySymbol,
} from "#/utils/database.ts";
import { formatYMD, sleep } from "#/utils/utils.ts";
import Fetcher, { AsyncCatch } from "#fetcher";
import { logger } from "@etf-visualizer/logger";
import dayjs from "dayjs";
import type { SSEStreamingApi } from "hono/streaming";

export const fetcher = new Fetcher();
export const xueQiu = new XueQiu(fetcher);
export const weibo = new WeiboSpider(fetcher);

export { XueQiu, Fetcher, WeiboSpider, weibo as weiboSpider };

export class Services {
  async findOrInsertWeiboUser(uid: number | string): Promise<WeiboUser> {
    let user = await findUserById(uid);

    if (user) {
      return user;
    }

    const userInfo = await weibo.getUserInfo(uid);
    const userDetail = await weibo.getUserDetail(uid);

    user = {
      user_id: userInfo.data.user.id,
      user_name: userInfo.data.user.screen_name,
      user_avatar: userInfo.data.user.profile_image_url,
      user_description: userInfo.data.user.description,
      user_created_at: userDetail.data.created_at,
      first_blog_id: "",
    };

    await insertUser(user);
    return user;
  }

  private async saveList(list: BlogParsed[], loggerMsg: string, stream: SSEStreamingApi) {
    try {
      logger.info(loggerMsg);
      await insertPost(list);
      await sleep(1000);
      await stream.writeSSE({
        data: JSON.stringify({
          range: loggerMsg,
        }),
        event: "start",
      });
    } catch (error) {
      logger.error("保存博文失败", { error });
      throw error;
    }
  }

  async getAllBlog(uid: string, stream: SSEStreamingApi): Promise<WeiboUser> {
    const user = await this.findOrInsertWeiboUser(uid);
    const firstBlogId = user.first_blog_id;

    let startPage = 1;
    const { list, total } = await this.getBlogListWithParse(uid, startPage);

    const pageSize = Math.ceil(total / 20) + 1;

    await this.saveList(list, `爬取第 ${startPage} 页, 共 ${pageSize} 页`, stream);

    while (startPage <= pageSize) {
      const { list } = await this.getBlogListWithParse(uid, startPage);

      await sleep(1000);
      await this.saveList(list, `爬取第 ${startPage} 页, 共 ${pageSize} 页`, stream);

      if (firstBlogId) {
        // 说明已经爬取过，
        const latestPost = await findLatestPostByUserId(uid);
        const latestBlog = list.find((item) => item.id === latestPost?.id);
        logger.info(`存在已爬取数据 ${firstBlogId} ${latestBlog?.id}`);
        if (latestBlog) {
          break;
        }
      }

      if (list.length === 0) {
        // 数据 0 条，说明已经爬取完毕，将最后一条博文的 id 更新到 user 中
        logger.info(`爬取数据 ${list.length} 条，结束爬取`);
        const lastBlog = await findLatestPostByUserId(uid);
        await updateUserFirstBlogId(uid, lastBlog?.id || "");
        break;
      }

      startPage++;
    }

    return user;
  }

  @AsyncCatch("Failed to insert post")
  async getBlogListWithParse(uid: number | string, page: number) {
    const res = await weibo.getBlogList(uid, page);

    const list = await this.parseBlogList(res.data.list);

    return {
      list,
      total: res.data.total,
    };
  }

  private async parseBlogList(list: BlogJSONType["data"]["list"]): Promise<BlogParsed[]> {
    try {
      const res: BlogParsed[] = [];
      for (const item of list) {
        const ref_link = item?.retweeted_status
          ? `${item?.retweeted_status?.user?.id}/${item?.retweeted_status?.mblogid}`
          : "";

        const parsedItem: BlogParsed = {
          id: String(item.id),
          blog_id: String(item.mblogid),
          user_id: String(item.user.id),
          user_name: item.user.screen_name,
          pic_ids: item.pic_ids,
          text: item.text_raw,
          time: item.created_at,
          ref_link,
          ref_text: item?.retweeted_status?.text || "",
        };

        // 处理长文本
        if (item.isLongText) {
          const longTextData = await weibo.getLongText(item.mblogid);
          parsedItem.text = longTextData?.data?.longTextContent;
        }
        res.push(parsedItem);
      }

      return res;
    } catch (error) {
      logger.error("解析失败", { error });
      return [];
    }
  }

  @AsyncCatch("获取详情及K线失败")
  async fetchStockDetailAndKline(symbol: string) {
    // 查询 db 是否存在 symbol 数据
    const shouldUpdate = await this.shouldUpdateSecurity(symbol);
    console.log("shouldUpdate", shouldUpdate);

    // 如果不需要更新，返回缓存数据
    if (!shouldUpdate) {
      const securityInfo = await findSecurityBySymbol(symbol);
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
          kline: securityInfo.kline,
        };
      }
    }

    // 不存在或需要更新，查询详情获取 issue_date，查询 kline 获取 begin 和 end
    const detail = await xueQiu.fetchStockDetail(symbol);
    const { issue_date, exchange, symbol: symbol_xq, code } = detail.quote;

    let begin = dayjs(issue_date).valueOf();
    const end = dayjs().valueOf();

    if (typeof shouldUpdate !== "boolean") {
      begin = shouldUpdate.valueOf();
    }

    const kline = await xueQiu.fetchStockKline({
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
    await insertOrUpdateSecurityInfo(securityInfo);

    await insertOrUpdateSecurityHistory(symbol_xq, this.formatKline(kline));

    return { detail, kline };
  }

  private async shouldUpdateSecurity(symbol: string): Promise<boolean | dayjs.Dayjs> {
    try {
      const security = await findSecurityBySymbol(symbol);

      const kline = await findSecurityHistoryBySymbol(symbol);
      console.log("kline", kline);
      // 如果不存在数据，需要更新
      if (!security || !kline?.length) return true;

      const now = dayjs();
      const updatedAt = dayjs(security.updated_at);

      console.log("updatedAt", updatedAt.format("YYYY-MM-DD HH:mm:ss"));

      // 判断是否为同一天
      if (!updatedAt.isSame(now, "day")) return updatedAt;

      // 判断更新时间是否小于 15:00:00
      if (updatedAt.hour() < 15) {
        // 如果当前时间大于 15:00:00 则需要更新
        if (now.hour() >= 15) return updatedAt;
      }

      // 不需要更新
      return false;
    } catch (error) {
      logger.error("判断是否需要更新证券信息失败", { error, symbol });
      // 出错时默认需要更新
      return true;
    }
  }

  private formatKline(kline: ChartKlineJSON) {
    return kline.data.item.map((i) => ({
      timestamp: i[0],
      volume: i[1],
      open: i[2],
      high: i[3],
      low: i[4],
      close: i[5],
    }));
  }
}

const services = new Services();

export { services };
