import { createTRPCClient } from "@trpc/client";
import { httpBatchLink } from "@trpc/client/links/httpBatchLink";
import type { AppRpcRouter as SpiderRpcRouter } from "@etf-visualizer/spider";

export const SpiderTrpcClient = createTRPCClient<SpiderRpcRouter>({
  links: [
    httpBatchLink({
      url: "http://localhost:3100/trpc",
    }),
  ],
});

// TODO: add types
export const ServerTrpcClient = createTRPCClient({
  links: [
    httpBatchLink({
      url: "http://localhost:3200/trpc",
    }),
  ],
});
