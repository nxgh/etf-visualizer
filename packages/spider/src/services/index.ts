import WeiboSpider from "#/site/weibo/index.ts";
import type { BlogParsed, GetBlogListByDateRangeParams } from "#/site/weibo/types/type.js";
import XueQiu from "#/site/xueqiu/index.ts";
import {
  findUserById,
  insertUser,
  checkPostExists,
  updateUserFirstBlogId,
  insertPost,
  findPostById,
  findLatestPostByUserId,
} from "#/utils/database.ts";
import { formatYMD, sleep } from "#/utils/utils.ts";
import Fetcher, { AsyncCatch } from "#fetcher";
import { logger } from "@etf-visualizer/logger";
import dayjs from "dayjs";
import type { SSEStreamingApi } from "hono/streaming";

const fetcher = new Fetcher();
const xueQiu = new XueQiu(fetcher);
const weibo = new WeiboSpider(fetcher);

export { xueQiu, weibo };

class Services {
  async findOrInsertWeiboUser(uid: number | string) {
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

  async getAllBlog(uid: string, stream: SSEStreamingApi) {
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
        const latestBlog = list.find((item) => item.id === latestPost.id);
        logger.info(`存在已爬取数据 ${firstBlogId} ${latestBlog?.id}`);
        if (latestBlog) {
          break;
        }
      }

      if (list.length === 0) {
        // 数据 0 条，说明已经爬取完毕，将最后一条博文的 id 更新到 user 中
        logger.info(`爬取数据 ${list.length} 条，结束爬取`);
        const lastBlog = await findLatestPostByUserId(uid);
        await updateUserFirstBlogId(uid, lastBlog.id);
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

  private async parseBlogList(list: any): Promise<BlogParsed[]> {
    try {
      const res = [];
      for (const item of list) {
        const ref_link = item?.retweeted_status
          ? `${item?.retweeted_status?.user?.id}/${item?.retweeted_status?.mblogid}`
          : "";

        let parsedItem = {
          id: item.id,
          blog_id: item.mblogid,
          user_id: item.user.id,
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
}

const services = new Services();

export { services };
