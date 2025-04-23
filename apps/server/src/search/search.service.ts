import { xueQiu, danJuan } from "#utils/fetcher.ts";
import { logger } from "@etf-visualizer/shared";

async function SearchService(keyword: string) {
  try {
    const stockList = await xueQiu.search_by_keyword(keyword);
    const fundList = await danJuan.search_by_keyword(keyword);
    return {
      stock: stockList!,
      fund: fundList!,
    };
  } catch (error) {
    logger.error(`Get SearchList ${keyword} Failed`, error);
    throw error;
  }
}

export type SearchServiceResponse = Awaited<ReturnType<typeof SearchService>>;
export default SearchService;
