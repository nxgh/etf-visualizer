import { watchListStoreAction } from "#store";
import { useEffect, useState } from "react";
import { quoteAction } from "#actions/index";
import type { XueQiuType } from "@etf-visualizer/spider";

export function Favorite() {
  const watchList = watchListStoreAction.use.watchList();

  const [data, setData] = useState<XueQiuType.StockQuoteData["quote"][]>([]);

  useEffect(() => {
    const symbols = watchList.map((item) => item.code);
    quoteAction(symbols).then((res) => {
      console.log(res);
      setData(res);
    });
  }, [watchList]);

  return (
    <div>
      {data.map((item) => (
        <div key={item.symbol} className="flex items-center gap-2">
          <div>{item.name}</div>
          <div>{item.symbol}</div>
          <div className={item.open < item.current ? "text-red-500" : "text-green-500"}>{item.current}</div>
          <div>{item.open}</div>
        </div>
      ))}
    </div>
  );
}
