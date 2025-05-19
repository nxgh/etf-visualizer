import type { Hono } from "hono";
import { createServer } from "./server.ts";
import { get } from "lodash-es";
import { fileURLToPath } from 'node:url';


export { registerRoutes as registerServerRoutes, type RestRouteType, type AppRpcRouter } from "./routes/index.ts";
export { default as tRpcRouter } from "./routes/rpc-route.ts";
export { SyncService, syncService } from "./services/index.ts";

export interface ServerConfig {
  port: number;
  host?: string;
}

export interface ServerInstance {
  app: Hono;
  start: (config: ServerConfig) => Promise<void>;
}

// 如果直接运行此文件，则启动服务器
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const server = await createServer();
  await server.start({ port: Number(get(process.env, "SERVER_PORT", 3200)) });
}
