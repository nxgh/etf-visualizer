import dotenv from "dotenv";
import fs from "fs";
import { fileURLToPath } from "url";
import path, { dirname } from "path";

dotenv.config();

export const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export function get_ids() {
  try {
    const env_ids = process.env.USER_IDS;
    if (!env_ids) {
      throw new Error();
    }
    const ids = env_ids.split(",");

    return ids;
  } catch (error) {
    console.log("ENV: USER_IDS is not set");
    process.exit(1);
  }
}

export async function save_image(buffer: Buffer, filename: string, dir: string = "images") {
  try {
    // 获取当前文件所在目录
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = dirname(__filename);

    // 创建images目录（如果不存在）
    const imagesDir = path.join(__dirname, dir);
    if (!fs.existsSync(imagesDir)) {
      fs.mkdirSync(imagesDir);
    }

    const filePath = path.join(imagesDir, filename);
    if (fs.existsSync(filePath)) {
      return filename;
    }

    await fs.promises.writeFile(filePath, buffer);
    return filename;
  } catch (error) {
    console.error(`Error fetching and saving image: ${filename}`, error);
    return null;
  }
}

export async function save_raw_json(json: any, filename: string, dir: string = "json") {
  try {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = dirname(__filename);
    const imagesDir = path.join(__dirname, dir);
    if (!fs.existsSync(imagesDir)) {
      fs.mkdirSync(imagesDir);
    }

    const filePath = path.join(imagesDir, filename);
    await fs.promises.writeFile(filePath, JSON.stringify(json, null, 2));
  } catch (error) {
    console.error(`Error saving raw json: ${filename}`, error);
    return null;
  }
}
