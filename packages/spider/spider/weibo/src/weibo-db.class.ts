import sqlite3 from "better-sqlite3";
import * as fs from "node:fs";
import * as path from "node:path";

export interface WDbType {
  insert: (value: IPost & { images: Array<unknown> }) => void;
  find_by_id: (id: string) => unknown;
}

// 数据库类
export interface IPost {
  id: string;
  user_id: string;
  pic_ids: string;
  text: string;
  time: string;
  link: string;
  ref_link: string;
  ref_text: string;
}

export interface IImage {
  uid: string;
  post_id: string;
}

class WeiBoDB implements WDbType {
  db: sqlite3.Database;
  constructor() {
    const db = sqlite3(process.env.DATABASE_URL);
    // 创建表（如果不存在）
    const sqlFile = fs.readFileSync(path.join(process.cwd(), "/sql/create_post_table.sql"), "utf-8");
    db.exec(sqlFile);

    this.db = db;
  }

  async insert(value: IPost & { imgs?: Array<string> }) {
    const sql = fs.readFileSync(path.join(process.cwd(), "/sql/insert_item.sql"), "utf-8");

    await this.db.prepare(sql).run({
      post_id: value?.id || "",
      user_id: value?.user_id || "",
      text: value?.text || "",
      time: value?.time || "",
      ref_text: value?.ref_text || "",
      ref_link: value?.ref_link || "",
      pic_ids: JSON.stringify(value?.pic_ids),
    });

    // const sql2 = this.db.prepare("INSERT INTO images (uid, post_id) VALUES (@uid, @post_id)");
    // const insertTx = this.db.transaction((images) => {
    //   for (const uid of images) {
    //     if (uid) {
    //       sql2.run({ uid, post_id: value.id });
    //     }
    //   }
    // });
    // insertTx(value.imgs);
  }

  async find_by_id(id: string) {
    const sql = "SELECT * FROM posts WHERE post_id = ?";
    const data = await this.db.prepare(sql).get(id);
    return data;
  }
}

export default WeiBoDB;
