import logger from "#utils/logger.ts";

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
  Cookie: process.env.DAN_JUAN_COOKIE || "",
  ...headers,
});

const XUE_QIU_HEADER = (headers: HeadersInit | undefined = {}) => ({
  ...DEFAULT_HEADER_CONFIG,
  Host: "xueqiu.com",
  Referer: "https://xueqiu.com/",
  Cookie: process.env.XUE_QIU_COOKIE || "",
  ...headers,
});

const mergeHeaders = (headers: HeadersInit | undefined = {}) => {
  const headersInstance = new Headers();

  for (const [key, value] of Object.entries(headers)) {
    headersInstance.append(key, value);
  }
  return headersInstance;
};

const xueqiu = async (url: string, options?: RequestInit) => {
  return await fetch(url, {
    ...options,
    headers: mergeHeaders(XUE_QIU_HEADER(options?.headers)),
  });
};

const danJuan = async (url: string, options?: RequestInit) => {
  return await fetch(url, {
    ...options,
    headers: mergeHeaders(DAN_JUAN_HEADER(options?.headers)),
  });
};

const asyncWrapper = async <T>(fn: (...args: unknown[]) => Promise<T>, errorMessage: string, options?: RequestInit) => {
  try {
    return await fn();
  } catch (error: unknown) {
    logger.error(`Fetcher Error: ${errorMessage}`, {
      error: error instanceof Error ? error.stack : error,
      headers: options?.headers,
    });
    return null;
  }
};

class Fetcher {
  static DAN_JUAN_HEADER = DAN_JUAN_HEADER;
  static XUE_QIU_HEADER = XUE_QIU_HEADER;
  static HEADERS = DEFAULT_HEADER_CONFIG;

  headers: HeadersInit | undefined = {};

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

  async xueqiu(url: string, options?: RequestInit) {
    return await fetch(url, {
      ...options,
      headers: this.mergeHeaders(XUE_QIU_HEADER(this.headers)),
    });
  }

  async danJuan(url: string, options?: RequestInit) {
    return await fetch(url, {
      ...options,
      headers: this.mergeHeaders(DAN_JUAN_HEADER(this.headers)),
    });
  }

  async asyncWrapper<T>(fn: (...args: unknown[]) => Promise<T>, errorMessage: string) {
    try {
      return await fn();
    } catch (error: unknown) {
      logger.error(`Fetcher Error: ${errorMessage}`, {
        error: error instanceof Error ? error.stack : error,
        headers: this.headers,
      });
      return null;
    }
  }
}

export default Fetcher;
