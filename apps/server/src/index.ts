import "reflect-metadata";
import "dotenv/config";
import { serve } from "@hono/node-server";
import { get } from "lodash-es";
import dayjs from "dayjs";
import { logger } from "@etf-visualizer/shared";

import { SearchRoute, StockRoute } from "#/register-routes.ts";
import { createFactory } from "hono/factory";

const port = Number(get(process.env, "PORT", 3000));

const app = createFactory({
  initApp: (app) => {
    app.use(async (c, next) => {
      logger.info(
        `🔴 [${dayjs().format("YYYY-MM-DD HH:mm:ss")}  ${c.req.method} ${
          c.req.path
        }  ]
  Query: ${JSON.stringify(c.req.query())}
  Body: ${JSON.stringify(c.req.raw.body)}
  Params: ${JSON.stringify(c.req.param())}
  `
      );
      await next();
    });
  },
})
  .createApp()
  .basePath("/api")
  .route("/", SearchRoute)
  .route("/", StockRoute);

serve({ fetch: app.fetch, port }, (info) => {
  console.log(`Server is running on http://localhost:${info.port}`);
});

export default app;

export type AppType = typeof app;

export type { ResponseResultType, SearchServiceResponse } from "./types.d.ts";
