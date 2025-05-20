import { createTRPCClient } from "@trpc/client";

import { httpBatchLink } from "@trpc/client/links/httpBatchLink";

import type { AppRouter } from "../app/api/[[...route]]/route";

export const TrpcClient = createTRPCClient<AppRouter>({
  links: [
    httpBatchLink({
      url: "http://localhost:3000/api/trpc",
    }),
  ],
});
