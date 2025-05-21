import { Hono } from "hono";
import { xueQiu, weibo, services } from "#/services/index.ts";

import { streamSSE } from "hono/streaming";

const route = new Hono().basePath("/spider");

export const registerRestRoutes = (app: Hono) => {
  route.get("/search", async (c) => {
    const { keyword } = c.req.query();
    const result = await xueQiu.searchByKeyword(keyword);
    return c.json(result);
  });
  route.get("/kline", async (c) => {
    const { symbol, begin, end } = c.req.query();
    const result = await xueQiu.fetchStockKline({ symbol, begin, end });
    return c.json(result);
  });

  route.get("/detail", async (c) => {
    const { symbol } = c.req.query();
    const result = await services.fetchStockDetailAndKline(symbol);
    return c.json(result);
  });

  route.get("/quote", async (c) => {
    const { code } = c.req.query();
    const result = await xueQiu.fetchStockDetail(code);
    return c.json(result);
  });

  route.get("/weibo/blog/latest", async (c) => {
    const { uid, page, parse } = c.req.query();
    if (parse) {
      const result = await services.getBlogListWithParse(uid, Number(page));
      return c.json(result);
    }
    const result = await weibo.getBlogList(uid, Number(page));
    return c.json(result);
  });

  route.get("/weibo/image", async (c) => {
    const { pic_id } = c.req.query();
    const result = await weibo.getImage(pic_id);
    return c.json(result);
  });

  route.get("/weibo/longtext", async (c) => {
    const { id } = c.req.query();
    const result = await weibo.getLongText(id);
    return c.json(result);
  });

  route.get("/weibo/user", async (c) => {
    const { uid } = c.req.query();
    const result = await services.findOrInsertWeiboUser(uid);
    return c.json(result);
  });

  route.get("/weibo/blog/all", async (c) => {
    const { uid } = c.req.query();

    return streamSSE(c, async (stream) => {
      await services.getAllBlog(uid, stream);
    });
  });

  app.route("/", route);

  return route;
};

export type RestRouteType = ReturnType<typeof registerRestRoutes>;

export default registerRestRoutes;
