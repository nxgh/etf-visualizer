import { logger } from "@etf-visualizer/logger";

export const DEFAULT_HEADER_CONFIG = {
  "User-Agent":
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
  Accept: "*/*",
  "Accept-Encoding": "gzip, deflate, br, zstd",
  "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6",
  "Cache-Control": "no-cache",
  Connection: "keep-alive",
  Pragma: "no-cache",
  "Sec-Ch-Ua": '"Chromium";v="134", "Not:A-Brand";v="24", "Microsoft Edge";v="134"',
  "Sec-Ch-Ua-Mobile": "?0",
  "Sec-Ch-Ua-Platform": "macOS",
  "Sec-Fetch-Dest": "empty",
  "Sec-Fetch-Mode": "cors",
  "Sec-Fetch-Site": "same-origin",
};

const DAN_JUAN_HEADER = (headers: HeadersInit | undefined = {}) => ({
  ...DEFAULT_HEADER_CONFIG,
  Host: "danjuanfunds.com",
  Referer: "https://danjuanfunds.com/",
  Cookie: process.env.SPIDER_DAN_JUAN_COOKIE || "",
  ...headers,
});

const XUE_QIU_HEADER = (headers: HeadersInit | undefined = {}) => ({
  ...DEFAULT_HEADER_CONFIG,
  Host: "xueqiu.com",
  Referer: "https://xueqiu.com/",
  Cookie: process.env.SPIDER_XUE_QIU_COOKIE || "",
  ...headers,
});

const WEIBO_HEADER = (headers: HeadersInit | undefined = {}) => {
  const cookies = process.env.SPIDER_WEIBO_COOKIE || "";
  const xsrfToken = cookies.match(/XSRF-TOKEN=([^;]+)/)?.[1];

  return {
    ...DEFAULT_HEADER_CONFIG,
    Host: "weibo.com",
    Referer: "https://weibo.com/",
    Cookie: cookies,
    "X-XSRF-TOKEN": xsrfToken || "",
    ...headers,
  };
};

export function AsyncCatch(errorMessage: string) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;
    descriptor.value = async function (this: Fetcher, ...args: unknown[]) {
      try {
        return await originalMethod.apply(this, args);
      } catch (error: unknown) {
        logger.error(`Fetcher Error: ${errorMessage}`, {
          error: error instanceof Error ? error.stack : error,
          args,
        });
        return null;
      }
    };
    return descriptor;
  };
}

class Fetcher {
  static DAN_JUAN_HEADER = DAN_JUAN_HEADER;
  static XUE_QIU_HEADER = XUE_QIU_HEADER;
  static WEIBO_HEADER = WEIBO_HEADER;

  headers: HeadersInit | undefined = {};
  logger = logger;

  constructor(headers: HeadersInit | undefined = {}) {
    this.headers = headers;
  }

  mergeHeaders(headers: HeadersInit | undefined = {}) {
    const headersInstance = new Headers();

    for (const [key, value] of Object.entries(headers)) {
      headersInstance.append(key, value);
    }
    return headersInstance;
  }

  @AsyncCatch("Failed to fetch from Xueqiu")
  async XueQiu(url: string, options?: RequestInit) {
    return await fetch(url, {
      ...options,
      headers: this.mergeHeaders(XUE_QIU_HEADER(this.headers)),
    });
  }
  async XueQiuJSON<T>(url: string, options?: RequestInit): Promise<T> {
    const resp = await this.XueQiu(url, options);
    return (await resp.json()) as T;
  }

  @AsyncCatch("Failed to fetch from DanJuan")
  async DanJuan(url: string, options?: RequestInit) {
    return await fetch(url, {
      ...options,
      headers: this.mergeHeaders(DAN_JUAN_HEADER(this.headers)),
    });
  }
  async DanJuanJSON<T>(url: string, options?: RequestInit): Promise<T> {
    const resp = await this.DanJuan(url, options);
    return (await resp.json()) as T;
  }

  @AsyncCatch("Failed to fetch from Weibo")
  async Weibo(url: string, options?: RequestInit) {
    return await fetch(url, {
      ...options,
      headers: this.mergeHeaders(WEIBO_HEADER(this.headers)),
    });
  }

  async WeiboJSON<T>(url: string, options?: RequestInit): Promise<T> {
    const resp = await this.Weibo(url, options);
    return (await resp.json()) as T;
  }
}

export default Fetcher;

export type { Fetcher };
