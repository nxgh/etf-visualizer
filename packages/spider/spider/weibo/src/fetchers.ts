import * as fs from "fs";
import dotenv from "dotenv";
dotenv.config();

const myHeaders = new Headers();
myHeaders.append("Accept", " application/json, text/plain, */*");
myHeaders.append("Accept-Language", " zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6");
myHeaders.append("Cache-Control", " no-cache");
myHeaders.append("Client-Version", " v2.47.41");
myHeaders.append("Pragma", " no-cache ");
myHeaders.append("Priority", " u=1, i ");
myHeaders.append("Referer", " https://weibo.com/u/7519797263");
myHeaders.append("Sec-Ch-Ua", ' "Chromium";v="134", "Not:A-Brand";v="24", "Microsoft Edge";v="134"');
myHeaders.append("Sec-Ch-Ua-Mobile", " ?0");
myHeaders.append("Sec-Ch-Ua-Platform", '"macOS"');
myHeaders.append("Sec-Fetch-Dest", "empty");
myHeaders.append("Sec-Fetch-Mode", "cors");
myHeaders.append("Sec-Fetch-Site", "same-origin");
myHeaders.append("Server-Version", "v2025.03.06.3");
myHeaders.append(
  "User-Agent",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36 Edg/134.0.0.0"
);
myHeaders.append("X-Requested-With", " XMLHttpRequest");
myHeaders.append("X-XSRF-TOKEN", process.env.X_XSRF_TOKEN || "");
myHeaders.append("Cookie", process.env.COOKIE || "");
myHeaders.append("Host", "weibo.com");
myHeaders.append("Connection", "keep-alive");

const headers = { headers: myHeaders };

export async function get_long_text(id: string) {
  try {
    const res = await fetch(`https://weibo.com/ajax/statuses/longtext?id=${id}`, headers);
    const json = await res.json();
    if (json.ok === 1) {
      return json;
    }
    throw new Error(`fetch long text error: ${id}`, { cause: json });
  } catch (error) {
    throw new Error(`fetch long text error: ${id}`, { cause: error });
  }
}

export async function get_blog_list(uid: number | string, page: number) {
  try {
    const res = await fetch(`https://weibo.com/ajax/statuses/mymblog?uid=${uid}&page=${page}&feature=0`, headers);
    const json = await res.json();
    if (json.ok === 1) {
      return json;
    }
    throw new Error(`fetch blog list error: ${uid}`, { cause: json });
  } catch (error) {
    throw new Error(`fetch blog list error: ${uid}`, { cause: error });
  }
}

export async function get_images(pic_id: string) {
  try {
    const response = await fetch(`https://wx3.sinaimg.cn/large/${pic_id}.jpg`, headers);
    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.statusText}`);
    }
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    return buffer;
  } catch (error) {
    throw new Error(`fetch images error: ${pic_id}`, { cause: error });
  }
}
