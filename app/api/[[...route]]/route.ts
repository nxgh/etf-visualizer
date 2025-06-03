import { Hono } from "hono";
import { handle } from "hono/vercel";
import { trpcServer } from "@hono/trpc-server";

import { createAppRouter } from "#server/routes/rpc-route";
import { registerRestRoutes } from "#server/routes/route";

export const runtime = "nodejs";

export const appRouter = createAppRouter();

export type AppRouter = typeof appRouter;

const app = new Hono().basePath("/api");
registerRestRoutes(app);

app.use(
  "/trpc/*",
  trpcServer({
    endpoint: "/api/trpc",
    router: appRouter,
  })
);

export const GET = handle(app);
export const POST = handle(app);
