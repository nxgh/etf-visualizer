import Spider from "@etf-visualizer/spider";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// TODO: 优先使用根目录下的 .env 文件，合并到当前目录下的 .env 文件
dotenv.config({
  path: path.resolve(fileURLToPath(import.meta.url), "../../../../../.env"),
});

const xueQiuFetcher = new Spider.Fetcher({
  Cookie: process.env.XUE_QIU_COOKIE || "",
});

const danJuanFetcher = new Spider.Fetcher({
  Cookie: process.env.DAN_JUAN_COOKIE || "",
});

export const xueQiu = new Spider.XueQiu(xueQiuFetcher);
export const danJuan = new Spider.DanJuan(danJuanFetcher);
