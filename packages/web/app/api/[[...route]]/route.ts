import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { tRpcRouter as ServerRpcRouter } from "@etf-visualizer/server";
// import { createContext } from "@etf-visualizer/server/context";
import { tRpcRouter as SpiderRpcRouter } from "@etf-visualizer/spider";

import { initTRPC } from "@trpc/server";
const t = initTRPC.create();

export const router = t.router;
// export const publicProcedure = t.procedure;

const appRouter = router({
  server: ServerRpcRouter,
  spider: SpiderRpcRouter,
});

export type AppRouter = typeof appRouter;

const handler = (req: Request) =>
  fetchRequestHandler({
    endpoint: "/api/trpc",
    req,
    router: appRouter,
    // createContext,
  });

export { handler as GET, handler as POST };
