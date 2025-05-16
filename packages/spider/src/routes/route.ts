import { Hono } from "hono";
import { xueQiu, weibo } from "#/services/index.ts";

const route = new Hono().basePath("/api");

export default function registerRoutes(app: Hono) {
  route.get("/search", async (c) => {
    const { keyword } = c.req.query();
    const result = await xueQiu.searchByKeyword(keyword);
    return c.json(result);
  });
  route.get("/kline", async (c) => {
    const { code, begin, end } = c.req.query();
    const result = await xueQiu.fetchStockKline({ code, begin, end });
    return c.json(result);
  });

  route.get("/quote", async (c) => {
    const { code } = c.req.query();
    const result = await xueQiu.fetchStockDetail(code);
    return c.json(result);
  });

  route.get("/weibo/blogs", async (c) => {
    const { uid, page, parse } = c.req.query();
    if (parse) {
      const result = await weibo.getBlogListWithParse(uid, Number(page));
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

  app.route("/", route);
}
