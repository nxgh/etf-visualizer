import WeiboSpider from "#/site/weibo/index.ts";
import XueQiu from "#/site/xueqiu/index.ts";
import Fetcher from "#fetcher";

const fetcher = new Fetcher();
const xueQiu = new XueQiu(fetcher);
const weibo = new WeiboSpider(fetcher);

export { xueQiu, weibo };
