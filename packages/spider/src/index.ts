import "reflect-metadata";
import { serve } from "@hono/node-server";
import { get } from "lodash-es";
import dayjs from "dayjs";
import { logger } from "@etf-visualizer/logger";

import { createFactory } from "hono/factory";
import { registerRoutes } from "./routes/index.ts";
const port = Number(get(process.env, "PORT", 3101));

const app = createFactory({
  initApp: (app) => {
    app.use(async (c, next) => {
      logger.info(
        `🔴 [${dayjs().format("YYYY-MM-DD HH:mm:ss")}  ${c.req.method} ${c.req.path}  ]
  Query: ${JSON.stringify(c.req.query())}
  Body: ${JSON.stringify(c.req.raw.body)}
  Params: ${JSON.stringify(c.req.param())}
`
      );
      await next();
    });
  },
}).createApp();

registerRoutes(app);

serve({ fetch: app.fetch, port }, (info) => {
  console.log(`Server is running on http://localhost:${info.port}`);
});

export default app;

export type AppType = typeof app;

export type { AppRpcRouter } from "./routes/rpc-route.ts";
