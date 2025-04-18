import "reflect-metadata";
import "dotenv/config";

import type { Hono } from "hono";
import { logger as honoLogger } from "hono/logger";
import { logger } from "@etf-visualizer/shared";

import SearchRoute from "./search/search.route.ts";
import StockRoute from "./stock/stock.route.ts";

export default function registerRestRoutes(app: Hono) {
  const apiApp = app.basePath("/api");
  apiApp.use(
    honoLogger((message: string, ...rest: string[]) => {
      if (message.includes("<--")) {
        logger.info(`${message.replace("<--", "🚩🚩🚩🚩🚩🚩")} `);
      } else if (message.includes("-->")) {
        logger.info(`${message.replace("-->", "🔚🔚🔚🔚🔚🔚")} `);
      } else {
        logger.info(`${message}`);
      }
    })
  );
  apiApp.route("/", SearchRoute).route("/", StockRoute);
}
