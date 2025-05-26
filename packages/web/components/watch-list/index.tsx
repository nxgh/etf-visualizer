"use client";

import { Trash2 } from "lucide-react";

import { cn } from "@shadcn/lib/utils";

import { ScrollArea } from "@shadcn/ui/scroll-area";

import { watchListStoreAction } from "#stores/index";

// 涨跌% label

const PercentLabel = ({ value }: { value: number }) => {
  return <span className={cn("text-sm text-gray-400", value < 0 ? "text-green-500" : "text-red-500")}>{value}%</span>;
};

export default function WatchListIndex({
  className,
  onClickItem,
}: {
  className?: string;
  onClickItem: (code: string, type: string) => void;
}) {
  // store
  const watchList = watchListStoreAction.use.watchList();
  const removeWatchList = watchListStoreAction.use.remove();

  const handleClickItem = (code: string) => {
    // setCode(code);
    onClickItem(code, "stock");
  };

  const percent = () => {
    const r = (Math.random() * 10).toFixed(2);
    return (Number(r) * 100) % 2 === 0 ? Number(r) : -Number(r);
  };
  const price = () => {
    const r = Math.random().toFixed(3);
    return r;
  };

  return (
    <div id="watch-list" className={cn("flex flex-col w-full h-full overflow-hidden overflow-y-auto ", className)}>
      <ScrollArea className="h-full rounded-md w-full">
        <div className={cn("h-full flex flex-col overflow-x-hidden overflow-y-auto")}>
          {watchList.map((item) => {
            return (
              <div
                key={item.code}
                className="flex flex-col hover:bg-gray-100 cursor-pointer rounded bg-gray-50 mb-2 p-2 px-4 border border-gray-200"
              >
                <div className="flex flex-col  flex-1  gap-2 mb-2" onClick={() => handleClickItem(item.code)}>
                  {item.name}
                  <span className="text-xs text-gray-500"> [{item.code}]</span>
                </div>

                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <PercentLabel value={percent()} />
                    <span className="text-sm text-gray-400">{price()}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Trash2 className="size-4 text-red-300 hover:text-red-500" onClick={() => removeWatchList(item.code)} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
}
