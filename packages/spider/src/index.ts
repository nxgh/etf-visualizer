import "reflect-metadata";
import { get } from "lodash-es";

import { createServer } from "./server.ts";
import { scheduler } from "./utils/scheduler.ts";
import { fileURLToPath } from "node:url";

export { xueQiu, weibo, services, Services, XueQiu, WeiboSpider, Fetcher } from "./services/index.ts";

export { registerRestRoutes, tRpcRouter } from "./routes/index.ts";
export type { AppRpcRouter, RestRouteType } from "./routes/index.ts";

// 如果直接运行此文件，则启动服务器
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const server = await createServer();
  await server.start({ port: Number(get(process.env, "SERVER_PORT", 3200)) });

  // scheduler.start();
}
