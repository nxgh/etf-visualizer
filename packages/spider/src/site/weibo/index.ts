import { type Fetcher, AsyncCatch } from "#fetcher";
import dayjs from "dayjs";
import type { BlogJSONType, ILongText } from "./type.d.ts";
import { logger } from "@etf-visualizer/logger";

class WeiboSpider {
  private fetcher: Fetcher;
  constructor(fetcher: Fetcher) {
    this.fetcher = fetcher;
  }

  @AsyncCatch("Failed to fetch long text")
  async getLongText(id: string) {
    const res = await this.fetcher.WeiboJSON<ILongText>(`https://weibo.com/ajax/statuses/longtext?id=${id}`);
    if (res.ok !== 1) {
      throw new Error(`fetch long text error: ${id}`, { cause: res });
    }
    return res;
  }

  @AsyncCatch("Failed to fetch blog list")
  async getBlogList(uid: number | string, page: number) {
    const res = await this.fetcher.WeiboJSON<BlogJSONType>(
      `https://weibo.com/ajax/statuses/mymblog?uid=${uid}&page=${page}&feature=0`
    );
    if (res.ok !== 1) {
      throw new Error(`fetch blog list error: ${uid}`, { cause: res });
    }
    return res;
  }

  @AsyncCatch("Failed to fetch image")
  async getImage(pic_id: string) {
    const response = await this.fetcher.Weibo(`https://wx3.sinaimg.cn/large/${pic_id}.jpg`);
    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${pic_id}`);
    }
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    return buffer;
  }

  @AsyncCatch("Failed to fetch blog list")
  async getBlogListWithParse(uid: number | string, page: number) {
    const res = await this.getBlogList(uid, page);

    return this.parseBlogList(res.data.list);
  }

  private async parseBlogList(list: any) {
    try {
      const res = [];
      for (const item of list) {
        let parsedItem = {
          id: item.id,
          blog_id: item.mblogid,
          user_id: item.user.id,
          user_name: item.user.screen_name,
          pic_ids: item.pic_ids,
          text: item.text_raw,
          time: dayjs(item.created_at).format("YYYY-MM-DD HH:mm:ss"),
          // link: `https://weibo.com/${item.user.id}/${item.mblogid}`,
          ref_link: item?.retweeted_status
            ? `${item?.retweeted_status?.user?.id}/${item?.retweeted_status?.mblogid}`
            : "",
          ref_text: item?.retweeted_status?.text || "",
        };

        // 处理长文本
        if (item.isLongText) {
          const longTextData = await this.getLongText(item.mblogid);
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

export default WeiboSpider;
