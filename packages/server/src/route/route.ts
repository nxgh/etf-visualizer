import { Hono } from "hono";

const route = new Hono().basePath("/api");

export default function registerRoutes(app: Hono) {
  route.get("/sync", async (c) => {
    const { userId, clientId, data } = c.req.query();

    return c.json({});
  });

  app.route("/", route);
}
