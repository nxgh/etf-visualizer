import dotenv from "dotenv";
dotenv.config();

import dayjs from "dayjs";

import * as api from "./fetchers";
import { get_ids, sleep } from "./utils";

import WeiBoDB from "./weibo-db.class";

const db = new WeiBoDB();

const ids = get_ids();

async function parse_blog_item(list: any) {
  try {
    const res = [];
    for (const item of list) {
      if (!ids.includes(String(item.user.id))) continue;

      let parsedItem = {
        id: item.mblogid,
        user_id: item.user.id,
        pic_ids: item.pic_ids,
        text: item.text_raw,
        time: dayjs(item.created_at).format("YYYY-MM-DD HH:mm:ss"),
        link: `https://weibo.com/${item.user.id}/${item.mblogid}`,
        ref_link: item?.retweeted_status
          ? `${item?.retweeted_status?.user?.id}/${item?.retweeted_status?.mblogid}`
          : "",
        ref_text: item?.retweeted_status?.text || "",
      };

      // 处理长文本
      if (item.isLongText) {
        const longTextData = await api.get_long_text(item.mblogid);
        parsedItem.text = longTextData?.data?.longTextContent;
      }
      res.push(parsedItem);
    }

    return res;
  } catch (error) {
    console.log("解析失败", error);
    return [];
  }
}

async function start(user_id: string) {
  try {
    const res = await api.get_blog_list(user_id, 1);
    const { list, total } = res.data;
    const page = Math.ceil(total / 20);

    const parsed_list = await parse_blog_item(list);

    // 检查每个微博ID是否存在于数据库中
    const existingPosts = await Promise.all(
      parsed_list.map(async (item) => {
        const exists = await db.find_by_id(item.id);
        return { item, exists };
      })
    );

    // 筛选出不存在的微博
    const newPosts = existingPosts.filter((post) => !post.exists).map((post) => post.item);

    // 更新逻辑处理
    if (newPosts.length === 0) {
      // 1. 所有 id 都在库中，直接退出
      console.log(`用户 ${user_id} 的微博已经是最新的`);
      return;
    }
    if (newPosts.length < parsed_list.length) {
      // 2. 部分 id 在库中，部分 id 不在库中，将不在库中的 id 插入库中
      console.log(`用户 ${user_id} 有 ${newPosts.length} 条新微博`);
      for (const post of newPosts) {
        await db.insert(post);
      }
    }
    // 3. 所有 id 都不在库中，将所有 id 插入库中，继续查询下一页
    if (newPosts.length === parsed_list.length) {
      console.log(`用户 ${user_id} 的第 1 页全是新微博，继续查询下一页`);
      for (const post of newPosts) {
        await db.insert(post);
      }
    }

    // 继续获取后续页面的数据
    for (let currentPage = 2; currentPage <= page; currentPage++) {
      console.log(`正在获取第 ${currentPage} 页数据`);
      await sleep(Number(process.env.SLEEP_TIME || 0));
      const nextRes = await api.get_blog_list(user_id, currentPage);
      const nextParsedList = await parse_blog_item(nextRes.data.list);

      // 检查新页面的微博是否存在
      const nextExistingPosts = await Promise.all(
        nextParsedList.map(async (item) => {
          const exists = await db.find_by_id(item.id);
          return { item, exists };
        })
      );

      const nextNewPosts = nextExistingPosts.filter((post) => !post.exists).map((post) => post.item);

      if (nextNewPosts.length === 0) {
        console.log(`第 ${currentPage} 页没有新微博，停止获取`);
        break;
      }

      // 插入新微博
      for (const post of nextNewPosts) {
        await db.insert(post);
      }

      if (nextNewPosts.length < nextParsedList.length) {
        console.log(`第 ${currentPage} 页部分微博已存在，停止获取`);
        break;
      }
    }
  } catch (error) {
    console.log(error);
  }
}

(async () => {
  ids.forEach((id) => start(id));
})();
