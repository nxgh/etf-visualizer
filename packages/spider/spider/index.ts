import Fetcher from "./fetcher.ts";
import DanJuan from "./danjuanfund/index.ts";
import XueQiu from "./xueqiu/index.ts";

const fetcher = new Fetcher();
const danJuan = new DanJuan(fetcher);
const xueQiu = new XueQiu(fetcher);

export { danJuan, xueQiu };
