import { z } from "zod";
import { XueQiuService, WeiboService } from "../services/index";

import { initTRPC } from "@trpc/server";
const t = initTRPC.create();

export const router = t.router;
export const publicProcedure = t.procedure;

const createAppRouter = () => {
  const xueQiuService = new XueQiuService();
  const weiboService = new WeiboService();
  return router({
    search: publicProcedure.input(z.string()).query(async ({ input }) => {
      const result = await xueQiuService.searchByKeyword(input);

      return result;
    }),
    kline: publicProcedure
      .input(
        z.object({
          symbol: z.string(),
          begin: z.string(),
          end: z.string(),
        })
      )
      .query(async ({ input }) => {
        const result = await xueQiuService.fetchStockKline(input.symbol, input.begin, input.end);
        return result;
      }),
    quote: publicProcedure.input(z.string()).query(async ({ input }) => {
      const result = await xueQiuService.fetchStockDetail(input);
      return result;
    }),
    detail: publicProcedure
      .input(
        z.object({
          symbol: z.string(),
        })
      )
      .query(async ({ input }) => {
        const result = await xueQiuService.fetchStockDetailAndKline(input.symbol);
        return result;
      }),

    weibo: publicProcedure
      .input(
        z.object({
          uid: z.string(),
          page: z.number(),
          parse: z.boolean().optional(),
        })
      )
      .query(async ({ input }) => {
        const result = input.parse
          ? await weiboService.getBlogListWithParse(input.uid, input.page)
          : await weiboService.getBlogList(input.uid, input.page);
        return result;
      }),
    batchQuote: publicProcedure
      .input(
        z.object({
          symbols: z.string(),
        })
      )
      .query(async ({ input }) => {
        const result = await xueQiuService.batchQuote(input.symbols);
        return result;
      }),
  });
};

export { createAppRouter };
export type RpcRouter = ReturnType<typeof createAppRouter>;
