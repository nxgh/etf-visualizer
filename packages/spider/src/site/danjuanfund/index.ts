import { AsyncCatch, type Fetcher } from "#fetcher";
import type { FundItem, SearchByKeywordJSON } from "./type.ts";

class DanJuan {
  fetcher: Fetcher;
  constructor(fetcher: Fetcher) {
    this.fetcher = fetcher;
  }

  @AsyncCatch("获取基金列表失败")
  async searchByKeyword(keyword: string): Promise<FundItem[]> {
    const resp = await this.fetcher.DanJuan(
      `https://danjuanfunds.com/djapi/v2/search?key=${keyword}&xq_access_token=bd704c01c13b89ae8fb96b6b04e321ba1f60f3a0&source=index`
    );
    const data = (await resp.json()) as SearchByKeywordJSON;

    if (data.result_code !== 0) {
      throw new Error(JSON.stringify(data));
    }

    return data?.data.items.map((i: { scode: string; sname: string }) => ({
      code: i.scode,
      name: i.sname,
      type: "fund",
    }));
  }
}

export default DanJuan;
