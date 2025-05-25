import { serve } from "@hono/node-server";
import { get } from "lodash-es";
import dayjs from "dayjs";
import { logger } from "@etf-visualizer/logger";

import { createFactory } from "hono/factory";
import { registerRoutes } from "./routes/index.ts";
import type { ServerConfig, ServerInstance } from "./index.ts";

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
