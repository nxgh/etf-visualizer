import type { Hono } from "hono";

export { registerRoutes as registerRestRoutes, type RestRouteType, type AppRpcRouter } from "./routes/index.ts";
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
