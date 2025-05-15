import { Hono } from "hono";

import {
  GetDetailController,
  GetFavoriteController,
  PostFavoriteController,
  DeleteFavoriteController,
  GetHistoryController,
  PostTransactionController,
  DeleteTransactionController,
  PostTransactionHostController,
  GetTransactionController,
  GetTransactionHostController,
} from "./stock.controller.ts";

export default new Hono()
  .basePath("/stock")
  .get("/detail", ...GetDetailController)
  .get("/favorite", ...GetFavoriteController)
  .post("/favorite", ...PostFavoriteController)
  .delete("/favorite", ...DeleteFavoriteController)
  .get("/history", ...GetHistoryController)
  .get("/transaction", ...GetTransactionController)
  .post("/transaction", ...PostTransactionController)
  .delete("/transaction", ...DeleteTransactionController)
  .get("/transaction/host", ...GetTransactionHostController)
  .post("/transaction/host", ...PostTransactionHostController);
