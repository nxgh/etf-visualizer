import { z } from "zod";

import { initTRPC } from "@trpc/server";
const t = initTRPC.create();

export const router = t.router;
export const publicProcedure = t.procedure;

const appRouter = router({
  search: publicProcedure.input(z.string()).query(async ({ input }) => {
    return {};
  }),
});

export type AppRpcRouter = typeof appRouter;
export default appRouter;
