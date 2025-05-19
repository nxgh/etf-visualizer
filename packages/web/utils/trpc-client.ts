import { createTRPCClient } from "@trpc/client";

import { httpBatchLink } from "@trpc/client/links/httpBatchLink";
import type { AppRpcRouter } from "@etf-visualizer/spider";
import type { AppRpcRouter as ServerRpcRouter } from "@etf-visualizer/server";

export const SpiderTrpcClient = createTRPCClient<AppRpcRouter>({
  links: [
    httpBatchLink({
      url: "http://localhost:3000/spider/trpc",
    }),
  ],
});

export const ServerTrpcClient = createTRPCClient<ServerRpcRouter>({
  links: [
    httpBatchLink({
      url: "http://localhost:3000/api/trpc",
    }),
  ],
});
