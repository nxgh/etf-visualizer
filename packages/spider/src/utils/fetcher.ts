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

function mergeHeaders(headers: HeadersInit | undefined = {}) {
  const headersInstance = new Headers();

  for (const [key, value] of Object.entries(headers)) {
    headersInstance.append(key, value);
  }
  return headersInstance;
}

type Platform = "danjuan" | "xueqiu" | "weibo";

const PLATFORM_HEADERS: Record<Platform, (headers?: HeadersInit) => HeadersInit> = {
  danjuan: DAN_JUAN_HEADER,
  xueqiu: XUE_QIU_HEADER,
  weibo: WEIBO_HEADER,
};

async function fetchWithPlatform(platform: Platform, url: string, options?: RequestInit) {
  try {
    const opt = {
      ...options,
      headers: mergeHeaders(PLATFORM_HEADERS[platform](options?.headers)),
    };
    return await fetch(url, opt);
  } catch (error) {
    throw error;
  }
}

async function fetchJSON<T>(platform: Platform, url: string, options?: RequestInit): Promise<T> {
  const resp = await fetchWithPlatform(platform, url, options);
  return (await resp.json()) as T;
}

export async function fetchDanJuan<T = Response>(
  url: string,
  options?: RequestInit & { parseJSON?: boolean },
): Promise<T extends Response ? Response : T> {
  const { parseJSON = true, ...fetchOptions } = options || {};
  return (
    parseJSON ? fetchJSON<T>("danjuan", url, fetchOptions) : fetchWithPlatform("danjuan", url, fetchOptions)
  ) as Promise<T extends Response ? Response : T>;
}

export async function fetchXueQiu<T = Response>(
  url: string,
  options?: RequestInit & { parseJSON?: boolean },
): Promise<T extends Response ? Response : T> {
  const { parseJSON = true, ...fetchOptions } = options || {};
  return (
    parseJSON ? fetchJSON<T>("xueqiu", url, fetchOptions) : fetchWithPlatform("xueqiu", url, fetchOptions)
  ) as Promise<T extends Response ? Response : T>;
}

export async function fetchWeibo<T = Response>(
  url: string,
  options?: RequestInit & { parseJSON?: boolean },
): Promise<T extends Response ? Response : T> {
  const { parseJSON = true, ...fetchOptions } = options || {};
  return (
    parseJSON ? fetchJSON<T>("weibo", url, fetchOptions) : fetchWithPlatform("weibo", url, fetchOptions)
  ) as Promise<T extends Response ? Response : T>;
}
