import * as Weibo from "#/site/weibo/index.ts";
import type { BlogJSONType } from "#/site/weibo/types/blog.js";
import type { BlogParsed } from "#/site/weibo/types/type.js";
import {
  findUserById,
  insertUser,
  updateUserFirstBlogId,
  insertPost,
  findLatestPostByUserId,
  type WeiboUser,
} from "#/utils/database.ts";
import { sleep } from "#/utils/utils.ts";
import type { Logger } from "@etf-visualizer/logger";
import type { SSEStreamingApi } from "hono/streaming";

export async function parseBlogList(list: BlogJSONType["data"]["list"]): Promise<BlogParsed[]> {
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
        const longTextData = await Weibo.getLongText(item.mblogid);
        parsedItem.text = longTextData?.data?.longTextContent;
      }
      res.push(parsedItem);
    }

    return res;
  } catch (error) {
    throw error;
  }
}

class WeiboService {
  private logger: Logger;
  constructor(logger: Logger) {
    this.logger = logger;
  }
  async getBlogListWithParse(uid: number | string, page: number) {
    try {
      const res = await Weibo.getBlogList(uid, page);

      const list = await parseBlogList(res.data.list);

      return {
        list,
        total: res.data.total,
      };
    } catch (error) {
      this.logger.error("获取微博列表失败", { error });
      throw error;
    }
  }

  async getBlogList(uid: number | string, page: number) {
    try {
      const res = await Weibo.getBlogList(uid, page);
      return res;
    } catch (error) {
      this.logger.error("获取微博列表失败", { error });
      throw error;
    }
  }
  async getImage(pic_id: string) {
    try {
      const res = await Weibo.getImage(pic_id);
      return res;
    } catch (error) {
      this.logger.error("获取图片失败", { error });
      throw error;
    }
  }

  async getLongText(id: string) {
    try {
      const res = await Weibo.getLongText(id);
      return res;
    } catch (error) {
      this.logger.error("获取长文本失败", { error });
      throw error;
    }
  }

  async findOrInsertWeiboUser(uid: number | string): Promise<WeiboUser> {
    try {
      let user = await findUserById(uid);

      if (user) {
        return user;
      }

      const userInfo = await Weibo.getUserInfo(uid);
      const userDetail = await Weibo.getUserDetail(uid);

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
    } catch (error) {
      throw error;
    }
  }
  async getAllBlog(uid: string, stream: SSEStreamingApi): Promise<WeiboUser> {
    try {
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
          // logger.info(`存在已爬取数据 ${firstBlogId} ${latestBlog?.id}`);
          if (latestBlog) {
            break;
          }
        }

        if (list.length === 0) {
          // 数据 0 条，说明已经爬取完毕，将最后一条博文的 id 更新到 user 中
          // logger.info(`爬取数据 ${list.length} 条，结束爬取`);
          const lastBlog = await findLatestPostByUserId(uid);
          await updateUserFirstBlogId(uid, lastBlog?.id || "");
          break;
        }

        startPage++;
      }

      return user;
    } catch (error) {
      throw error;
    }
  }
  async saveList(list: BlogParsed[], loggerMsg: string, stream: SSEStreamingApi) {
    try {
      await insertPost(list);
      await sleep(1000);
      await stream.writeSSE({
        data: JSON.stringify({
          range: loggerMsg,
        }),
        event: "start",
      });
    } catch (error) {
      throw error;
    }
  }
}

export default WeiboService;
