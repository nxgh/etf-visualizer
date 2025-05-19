import "reflect-metadata";
import { get } from "lodash-es";

import { registerRoutes } from "./routes/index.ts";
import { createServer } from "./server.ts";
import { scheduler } from "./utils/scheduler.ts";
import { fileURLToPath } from 'node:url';

export type { AppRpcRouter, RestRouteType } from "./routes/index.ts";

// 如果直接运行此文件，则启动服务器
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const server = await createServer();
  await server.start({ port: Number(get(process.env, "SERVER_PORT", 3200)) });

  scheduler.start();
}
