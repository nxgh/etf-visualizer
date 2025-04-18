import { Hono } from "hono";
import ResponseResult from "#utils/ResponseResult.ts";

import { logger } from "@etf-visualizer/shared";
import SearchService from "./search.service.ts";

export default new Hono().get("/search", async (c) => {
  const { keyword } = c.req.query();

  if (!keyword) {
    logger.error(`Get SearchList ${keyword} Failed`, "参数错误");
    return c.json(ResponseResult.fail("参数错误", 400));
  }

  try {
    const result = await SearchService(keyword);
    return c.json(ResponseResult.success(result));
  } catch (error) {
    logger.error(`Get SearchList ${keyword} Failed`, error);
    return c.json(ResponseResult.fail("查询失败", 500));
  }
});
