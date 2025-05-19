import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { tRpcRouter } from "@etf-visualizer/spider";
// import { createContext } from "@etf-visualizer/server/context";

const handler = (req: Request) =>
  fetchRequestHandler({
    endpoint: "/spider/trpc",
    req,
    router: tRpcRouter,
    // createContext,
  });

export { handler as GET, handler as POST };
