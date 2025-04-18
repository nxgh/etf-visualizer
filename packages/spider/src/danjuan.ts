import type Fetcher from "./fetcher.ts";

class DanJuan {
  fetcher: Fetcher;
  constructor(fetcher: Fetcher) {
    this.fetcher = fetcher;
  }

  async search_by_keyword(keyword: string) {
    return this.fetcher.asyncWrapper<Response[]>(async () => {
      const resp = await this.fetcher.danJuan(
        `https://danjuanfunds.com/djapi/v2/search?key=${keyword}&xq_access_token=bd704c01c13b89ae8fb96b6b04e321ba1f60f3a0&source=index`
      );
      const data = await resp.json();
      if (data.result_code !== 0) {
        return data;
      }
      return data?.data.items.map((i: { scode: string; sname: string }) => ({
        code: i.scode,
        name: i.sname,
      }));
    }, "获取基金列表");
  }
}

export default DanJuan;
