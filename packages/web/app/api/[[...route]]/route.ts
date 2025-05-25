import { Hono } from "hono";
import { handle } from "hono/vercel";
import { trpcServer } from "@hono/trpc-server";
import { initTRPC } from "@trpc/server";

// import * as Server from "@etf-visualizer/server";
import * as Spider from "@etf-visualizer/spider";
// import type { Logger } from "@etf-visualizer/logger";

export const defaultLogger = {
  info: (message, ...rest) => console.log(message, ...rest),
  error: (message, ...rest) => console.error(message, ...rest),
  warn: (message, ...rest) => console.warn(message, ...rest),
  debug: (message, ...rest) => console.debug(message, ...rest),
};

const t = initTRPC.create();

export const router = t.router;

const appRouter = router({
  // server: Server.tRpcRouter,
  spider: Spider.createAppRouter(defaultLogger),
});

export const runtime = "edge";

const app = new Hono().basePath("/api");
// Server.registerRestRoutes(app);
Spider.registerRestRoutes(app, defaultLogger);

app.use(
  "/trpc/*",
  trpcServer({
    router: appRouter,
  })
);

export const GET = handle(app);
export const POST = handle(app);
