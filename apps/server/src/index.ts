import "reflect-metadata";
import "dotenv/config";
import { Hono } from "hono";
import { serve } from "@hono/node-server";
import { cors } from "hono/cors";
import { get } from "lodash-es";

import registerRestRoutes from "#/register-routes.ts";

const app = new Hono();

const port = Number(get(process.env, "PORT", 3000));

app.use("*", cors());

registerRestRoutes(app);

serve({ fetch: app.fetch, port }, (info) => {
  console.log(`Server is running on http://localhost:${info.port}`);
});

export default app;
