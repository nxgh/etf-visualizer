import { Hono } from "hono";
import { handle } from "hono/vercel";
import { trpcServer } from "@hono/trpc-server";
import { logger } from "#utils/logger";

import * as Spider from "@etf-visualizer/spider";

export const runtime = "nodejs";

export const appRouter = Spider.createAppRouter(logger);

export type AppRouter = typeof appRouter;

const app = new Hono().basePath("/api");
Spider.registerRestRoutes(app, logger);

app.use(
  "/trpc/*",
  trpcServer({
    endpoint: "/api/trpc",
    router: appRouter,
  })
);

export const GET = handle(app);
export const POST = handle(app);
