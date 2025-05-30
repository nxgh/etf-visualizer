import "reflect-metadata";

export {
  registerRestRoutes,
  createAppRouter,
  type RpcRouter,
  type RestRoute as RestRouteType,
} from "./routes/index.ts";

export { XueQiuService, WeiboService } from "#/services/index.ts";
