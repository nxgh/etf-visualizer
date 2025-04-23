import Spider from "@etf-visualizer/spider";

const xueQiuFetcher = new Spider.Fetcher({
  Cookie: process.env.XUE_QIU_COOKIE || "",
});

const danJuanFetcher = new Spider.Fetcher({
  Cookie: process.env.DAN_JUAN_COOKIE || "",
});

export const xueQiu = new Spider.XueQiu(xueQiuFetcher);
export const danJuan = new Spider.DanJuan(danJuanFetcher);
