import { createFactory } from "hono/factory";
import dayjs from "dayjs";

import { z } from "zod";

import { logger } from "@etf-visualizer/shared";
import { xueQiu } from "#utils/fetcher.ts";
import * as db from "@etf-visualizer/database";

import ResponseResult from "#utils/ResponseResult.ts";

const factory = createFactory();

const middleware = factory.createMiddleware(async (c, next) => {
  logger.info("🔴 [Request]", {
    path: c.req.path,
    method: c.req.method,
    query: c.req.query(),
    body: c.req.raw.body,
    params: c.req.param(),
  });
  await next();
});

/**
 * @description 获取详情数据
 * @route GET /stock/detail
 */
export const GetDetailController = factory.createHandlers(middleware, async (c) => {
  const { code } = c.req.query();
  logger.info("获取详情数据", { code });
  if (!code) {
    return c.json(ResponseResult.fail("参数错误", 400));
  }

  const data = await xueQiu.fetch_stock_detail(code);

  if (!data) {
    return c.json(ResponseResult.fail("获取详情数据失败", 500));
  }

  await db.insertStockDetail({
    code,
    name: data.quote.name,
    issue_date: dayjs(data.quote.issue_date).toDate(),
  });

  return c.json(ResponseResult.success(data));
});

/**
 * @description 获取收藏数据
 * @route GET /stock/favorite
 */
export const GetFavoriteController = factory.createHandlers(async (c) => {
  const data = await db.queryStockFavorite();

  return c.json(ResponseResult.success(data));
});

/**
 * @description 设置收藏
 * @route POST /stock/favorite
 */
export const PostFavoriteController = factory.createHandlers(async (c) => {
  const { code } = c.req.query();

  if (!code) {
    return c.json(ResponseResult.fail("参数错误", 400));
  }

  const data = await db.queryStockDetail(code);

  if (!data) {
    return c.json(ResponseResult.fail("代码不存在", 400));
  }

  const result = await db.updateSecurityFavorite(code, true);

  if (!result) {
    return c.json(ResponseResult.fail("收藏失败", 500));
  }

  return c.json(ResponseResult.success(true));
});

/**
 * @description 取消收藏
 * @route DELETE /stock/favorite
 */
export const DeleteFavoriteController = factory.createHandlers(async (c) => {
  const { code } = c.req.query();

  if (!code) {
    return c.json(ResponseResult.fail("参数错误", 400));
  }

  const data = await db.queryStockDetail(code);

  if (!data) {
    return c.json(ResponseResult.fail("代码不存在", 400));
  }

  const result = await db.updateSecurityFavorite(code, false);

  if (!result) {
    return c.json(ResponseResult.fail("取消收藏失败", 500));
  }

  return c.json(ResponseResult.success(true));
});

/**
 * @description 获取历史数据
 * @route GET /stock/history
 */
export const GetHistoryController = factory.createHandlers(async (c) => {
  const { code, begin, end } = c.req.query();

  if (!code || !begin || !end) {
    return c.json(ResponseResult.fail("参数错误", 400));
  }

  try {
    // 通过 code 查询数据最新一条，如果存在且update_at 为今天，返回查询结果，
    // 如果存在且update_at 不为今天，则更新数据
    const lastData = await db.queryLastStockHistory(code);
    const isSameDay = dayjs(lastData?.update_at).isSame(dayjs(), "day");

    if (isSameDay) {
      const cacheData = await db.queryFinancialHistory({
        code,
        begin: dayjs(begin).toDate(),
        end: dayjs(end).toDate(),
      });

      if (cacheData.length > 0) {
        return c.json(ResponseResult.success(cacheData));
      }
    }

    const detailData = await db.queryStockDetail(code);
    const issue_date = detailData?.issue_date;

    const _begin = lastData?.timestamp || issue_date;
    const _end = dayjs().toDate();

    const data = await xueQiu.fetch_stock_kline({
      code,
      begin: _begin,
      end: _end,
    });

    if (!data) {
      return c.json(ResponseResult.fail("获取K线数据失败", 500));
    }

    await db.insertFinancialHistory(data as unknown as db.QueryStockHistoryParams[]);

    return c.json(ResponseResult.success(data.length));
  } catch (error) {
    logger.error("获取K线数据失败", { error });
    return c.json(ResponseResult.fail(error, 500, "获取K线数据失败"));
  }
});

/**
 * @description 获取交易数据
 * @route GET /stock/transaction
 */
export const GetTransactionController = factory.createHandlers(async (c) => {
  const { code } = c.req.query();

  if (!code) {
    return c.json(ResponseResult.fail("参数错误", 400));
  }

  const data = await db.queryTransaction(code);

  return c.json(ResponseResult.success(data));
});

/**
 * @description 获取主理人交易数据
 * @route GET /stock/transaction/host
 */
export const GetTransactionHostController = factory.createHandlers(async (c) => {
  const { code } = c.req.query();

  if (!code) {
    return c.json(ResponseResult.fail("参数错误", 400));
  }

  const data = await db.queryTransactionHost(code);

  return c.json(ResponseResult.success(data));
});

/**
 * @description 插入交易数据
 * @route POST /stock/transaction
 */
export const PostTransactionController = factory.createHandlers(async (c) => {
  const request = await c.req.json();

  const data = Array.isArray(request) ? request : [request];

  const transactionSchema = z.object({
    code: z.string().min(1),
    timestamp: z.string(),
    type: z.string().min(1),
    price: z.number().positive(),
    volume: z.number().positive(),
  });

  const dataSchema = z.array(transactionSchema);

  try {
    dataSchema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return c.json(ResponseResult.fail(error.errors, 400, "数据验证失败"));
    }
    return c.json(ResponseResult.fail(null, 500, "服务器内部错误"));
  }

  await db.insertOrUpdateTransaction(data);

  return c.json(ResponseResult.success(true));
});

/**
 * @description 删除交易数据
 * @route DELETE /stock/transaction
 */
export const DeleteTransactionController = factory.createHandlers(async (c) => {
  const { ids } = c.req.query();

  const id = ids.split(",");

  try {
    await db.deleteTransaction(id);

    return c.json(ResponseResult.success(true));
  } catch (error) {
    logger.error("删除交易数据失败", { error });
    return c.json(ResponseResult.fail(null, 500, "删除交易数据失败"));
  }
});

/**
 * @description 插入主理人交易数据
 * @route POST /stock/transaction/host
 */
export const PostTransactionHostController = factory.createHandlers(async (c) => {
  const request = await c.req.json();

  try {
    const data = Array.isArray(request) ? request : [request];
    await db.insertOrUpdateHostTransaction(data);

    return c.json(ResponseResult.success(true));
  } catch (error) {
    logger.error("批量更新主理人交易数据失败", { error });
    return c.json(ResponseResult.fail(null, 500, "更新主理人交易数据失败"));
  }
});
