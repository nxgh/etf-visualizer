import type { Hono } from "hono";
import registerRestRoutes from "./route.ts";
import { trpcServer } from "@hono/trpc-server";
import appRouter from "./rpc-route.ts";

export const registerRoutes = (app: Hono) => {
  registerRestRoutes(app);
  app.use(
    "/trpc/*",
    trpcServer({
      router: appRouter,
    }),
  );
};

// export type { AppType } from "./route.ts";
// export type AppType = typeof app;

export type { AppRpcRouter } from "./rpc-route.ts";
export type { RestRouteType } from "./route.ts";
