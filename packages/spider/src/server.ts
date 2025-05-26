import { serve } from "@hono/node-server";
import { get } from "lodash-es";
import dayjs from "dayjs";
import { defaultLogger as logger } from "./utils/logger.ts";

import { createFactory } from "hono/factory";

import type { Hono } from "hono";
import { registerRestRoutes, createAppRouter } from "./routes/index.ts";
import { trpcServer } from "@hono/trpc-server";

export interface ServerConfig {
  port: number;
  host?: string;
}

export interface ServerInstance {
  app: Hono;
  start: (config: ServerConfig) => Promise<void>;
}

const appRouter = createAppRouter(logger);

export const registerRoutes = (app: Hono) => {
  registerRestRoutes(app);
  app.use(
    "/trpc/*",
    trpcServer({
      router: appRouter,
    }),
  );
};

export async function createServer(): Promise<ServerInstance> {
  const app = createFactory({
    initApp: (app) => {
      app.use(async (c, next) => {
        logger.info(
          `🔴 [${dayjs().format("YYYY-MM-DD HH:mm:ss")}  ${c.req.method} ${c.req.path}  ]
    Query: ${JSON.stringify(c.req.query())}
    Body: ${JSON.stringify(c.req.raw.body)}
    Params: ${JSON.stringify(c.req.param())}
  `,
        );
        await next();
      });
    },
  }).createApp();

  registerRoutes(app);

  return {
    app,
    start: async (config: ServerConfig) => {
      const port = config.port || Number(get(process.env, "SERVER_PORT", 3200));
      const host = config.host || "localhost";

      serve({ fetch: app.fetch, port }, (info) => {
        console.log(`Server is running on http://${host}:${info.port}`);
      });
    },
  };
}

// 如果直接运行此文件，则启动服务器

const server = await createServer();
await server.start({ port: Number(get(process.env, "SERVER_PORT", 3200)) });
