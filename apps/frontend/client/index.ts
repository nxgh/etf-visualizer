import { hc } from "hono/client";
import type { AppType } from "@etf-visualizer/server";


export const client = hc<AppType>("http://localhost:3000");


