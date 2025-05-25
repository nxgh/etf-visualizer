import { fetchWeibo } from "#fetcher";
import dayjs from "dayjs";
import type {
  BlogJSONType,
  GetBlogListByDateRangeParams,
  ILongText,
  UserDetailJSONType,
  UserJSONType,
} from "./types/type.d.ts";

const BASE_URL = "https://weibo.com";

export async function getLongText(id: string) {
  try {
    const res = await fetchWeibo<ILongText>(`${BASE_URL}/ajax/statuses/longtext?id=${id}`);
    if (res.ok !== 1) {
      throw new Error(`fetch long text error: ${id}`, { cause: res });
    }
    return res;
  } catch (error) {
    throw error;
  }
}

export async function getBlogList(uid: number | string, page: number) {
  try {
    const res = await fetchWeibo<BlogJSONType>(`${BASE_URL}/ajax/statuses/mymblog?uid=${uid}&page=${page}&feature=0`);
    if (res.ok !== 1) {
      throw new Error(`fetch blog list error: ${uid}`, { cause: res });
    }
    return res;
  } catch (error) {
    throw error;
  }
}

export async function getImage(pic_id: string) {
  try {
    const response = await fetchWeibo(`https://wx3.sinaimg.cn/large/${pic_id}.jpg`, { parseJSON: false });
    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${pic_id}`);
    }
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    return buffer;
  } catch (error) {
    throw error;
  }
}

export async function getUserInfo(uid: number | string) {
  try {
    const res = await fetchWeibo<UserJSONType>(`${BASE_URL}/ajax/profile/info?uid=${uid}`);

    if (res.ok !== 1) {
      throw new Error(`fetch user error: ${uid}`, { cause: res });
    }

    return res;
  } catch (error) {
    throw error;
  }
}

export async function getBlogListByDateRange(uid: number | string, params: GetBlogListByDateRangeParams) {
  try {
    const searchParams = {
      uid: String(uid),
      page: String(params.page || 1),
      starttime: String(dayjs(params?.starttime).valueOf()),
      endtime: String(dayjs(params?.endtime).valueOf()),
      hasori: params?.hasori || "1",
      hasret: params?.hasret || "1",
      hastext: params?.hastext || "1",
    };

    const url = `${BASE_URL}/ajax/statuses/searchProfile?${new URLSearchParams(searchParams).toString()}`;

    const res = await fetchWeibo<BlogJSONType>(url);

    if (res.ok !== 1) {
      throw new Error(`fetch blog list by date range error: ${uid}`, { cause: res });
    }

    return res;
  } catch (error) {
    throw error;
  }
}

export async function getUserDetail(uid: number | string) {
  try {
    const url = `${BASE_URL}/ajax/profile/detail?uid=${uid}`;
    const res = await fetchWeibo<UserDetailJSONType>(url);
    if (res.ok !== 1) {
      throw new Error(`fetch user detail error: ${uid}`, { cause: res });
    }
    return res;
  } catch (error) {
    throw error;
  }
}
