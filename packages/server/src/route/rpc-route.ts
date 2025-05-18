import { z } from "zod";

import { initTRPC } from "@trpc/server";
import { syncService } from "../services/index.js";
const t = initTRPC.create();

export const router = t.router;
export const publicProcedure = t.procedure;

const appRouter = router({
  // json 数据不必进行验证
  sync: publicProcedure
    .input(
      z.object({
        data: z.any(),
      }),
    )
    .mutation(async ({ input }) => {
      const { data } = input;

      // TODO: 格式化数据并保存
      const result = await syncService.sync("root", "web", data);
      return result;
    }),
});

export type AppRpcRouter = typeof appRouter;
export default appRouter;
