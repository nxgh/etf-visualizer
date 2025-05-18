import { type Fetcher, AsyncCatch } from "#fetcher";
import dayjs from "dayjs";
import type {
  BlogJSONType,
  BlogParsed,
  GetBlogListByDateRangeParams,
  ILongText,
  UserDetailJSONType,
  UserJSONType,
} from "./types/type.d.ts";

class WeiboSpider {
  private fetcher: Fetcher;

  private baseUrl: string;

  constructor(fetcher: Fetcher) {
    this.fetcher = fetcher;
    this.baseUrl = "https://weibo.com";
  }

  @AsyncCatch("Failed to fetch long text")
  async getLongText(id: string) {
    const res = await this.fetcher.WeiboJSON<ILongText>(`${this.baseUrl}/ajax/statuses/longtext?id=${id}`);
    if (res.ok !== 1) {
      throw new Error(`fetch long text error: ${id}`, { cause: res });
    }
    return res;
  }

  @AsyncCatch("Failed to fetch blog list")
  async getBlogList(uid: number | string, page: number) {
    const res = await this.fetcher.WeiboJSON<BlogJSONType>(
      `${this.baseUrl}/ajax/statuses/mymblog?uid=${uid}&page=${page}&feature=0`,
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

  @AsyncCatch("Failed to fetch user info")
  async getUserInfo(uid: number | string) {
    const res = await this.fetcher.WeiboJSON<UserJSONType>(`${this.baseUrl}/ajax/profile/info?uid=${uid}`);

    if (res.ok !== 1) {
      throw new Error(`fetch user error: ${uid}`, { cause: res });
    }

    return res;
  }

  @AsyncCatch("Failed to fetch blog list by date range")
  async getBlogListByDateRange(uid: number | string, params: GetBlogListByDateRangeParams) {
    const searchParams = {
      uid: String(uid),
      page: String(params.page || 1),
      starttime: String(dayjs(params?.starttime).valueOf()),
      endtime: String(dayjs(params?.endtime).valueOf()),
      hasori: params?.hasori || "1",
      hasret: params?.hasret || "1",
      hastext: params?.hastext || "1",
    };

    const url = `${this.baseUrl}/ajax/statuses/searchProfile?${new URLSearchParams(searchParams).toString()}`;

    const res = await this.fetcher.WeiboJSON<BlogJSONType>(url);

    if (res.ok !== 1) {
      throw new Error(`fetch blog list by date range error: ${uid}`, { cause: res });
    }

    return res;
  }

  @AsyncCatch("Failed to fetch user detail")
  async getUserDetail(uid: number | string) {
    const url = `${this.baseUrl}/ajax/profile/detail?uid=${uid}`;
    const res = await this.fetcher.WeiboJSON<UserDetailJSONType>(url);
    if (res.ok !== 1) {
      throw new Error(`fetch user detail error: ${uid}`, { cause: res });
    }
    return res;
  }
}

export default WeiboSpider;
