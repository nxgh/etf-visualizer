import { z } from "zod";
import { xueQiu, weibo, services } from "#/services/index.ts";

import { initTRPC } from "@trpc/server";
const t = initTRPC.create();

export const router = t.router;
export const publicProcedure = t.procedure;

const appRouter = router({
  search: publicProcedure.input(z.string()).query(async ({ input }) => {
    const result = await xueQiu.searchByKeyword(input);
    return result;
  }),
  kline: publicProcedure
    .input(
      z.object({
        code: z.string(),
        begin: z.string(),
        end: z.string(),
      }),
    )
    .query(async ({ input }) => {
      const result = await xueQiu.fetchStockKline(input);
      return result;
    }),
  quote: publicProcedure.input(z.string()).query(async ({ input }) => {
    const result = await xueQiu.fetchStockDetail(input);
    return result;
  }),

  weibo: publicProcedure
    .input(
      z.object({
        uid: z.string(),
        page: z.number(),
        parse: z.boolean().optional(),
      }),
    )
    .query(async ({ input }) => {
      const result = input.parse
        ? await services.getBlogListWithParse(input.uid, input.page)
        : await weibo.getBlogList(input.uid, input.page);
      return result;
    }),
});

export type AppRpcRouter = typeof appRouter;
export default appRouter;
