import { Hono } from "hono";

import { streamSSE } from "hono/streaming";

import XueQiuService from "../services/xueqiu";
import WeiboService from "../services/weibo";

const route = new Hono().basePath("/spider");

export const registerRestRoutes = (app: Hono) => {
  const xueQiuService = new XueQiuService();
  const weiboService = new WeiboService();

  route.get("/search", async (c) => {
    const { keyword } = c.req.query();

    const result = await xueQiuService.searchByKeyword(keyword);

    return c.json(result);
  });
  route.get("/kline", async (c) => {
    const { symbol, begin, end } = c.req.query();
    const result = await xueQiuService.fetchStockKline(symbol, begin, end);
    return c.json(result);
  });

  route.get("/detail", async (c) => {
    const { symbol } = c.req.query();
    const result = await xueQiuService.fetchStockDetailAndKline(symbol);
    return c.json(result);
  });

  route.get("/quote", async (c) => {
    const { code } = c.req.query();
    const result = await xueQiuService.fetchStockDetail(code);
    return c.json(result);
  });

  route.get("/weibo/blog/latest", async (c) => {
    const { uid, page, parse } = c.req.query();
    if (parse) {
      const result = await weiboService.getBlogListWithParse(uid, Number(page));
      return c.json(result);
    }
    const result = await weiboService.getBlogList(uid, Number(page));
    return c.json(result);
  });

  route.get("/weibo/image", async (c) => {
    const { pic_id } = c.req.query();
    const result = await weiboService.getImage(pic_id);
    return c.json(result);
  });

  route.get("/weibo/longtext", async (c) => {
    const { id } = c.req.query();
    const result = await weiboService.getLongText(id);
    return c.json(result);
  });

  route.get("/weibo/user", async (c) => {
    const { uid } = c.req.query();
    const result = await weiboService.findOrInsertWeiboUser(uid);
    return c.json(result);
  });

  route.get("/weibo/blog/all", async (c) => {
    const { uid } = c.req.query();

    return streamSSE(c, async (stream) => {
      await weiboService.getAllBlog(uid, stream);
    });
  });

  route.get("/quote/batch", async (c) => {
    const { symbols } = c.req.query();
    const result = await xueQiuService.batchQuote(symbols);
    return c.json(result);
  });

  app.route("/", route);

  return route;
};

export type RestRoute = ReturnType<typeof registerRestRoutes>;
