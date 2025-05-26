"use client";

import { Trash2 } from "lucide-react";

import { cn } from "@shadcn/lib/utils";

import { ScrollArea } from "@shadcn/ui/scroll-area";

import { watchListStoreAction } from "#stores/index";
import { useEffect, useRef, useState } from "react";
import { SimpleTable } from "@shadcn/component";
import { throttle } from "lodash-es";
import { Table } from "@shadcn/antd/table";

function useObserverWidthResize() {
  const ref = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    if (ref.current) {
      // 创建节流的 setWidth 函数，每 200ms 最多执行一次
      const throttledSetWidth = throttle((width: number) => {
        setWidth(width);
        console.log(width);
      }, 200);

      const observer = new ResizeObserver((entries) => {
        for (const entry of entries) {
          throttledSetWidth(entry.contentRect.width);
        }
      });

      observer.observe(ref.current);

      return () => {
        observer.disconnect();
        throttledSetWidth.cancel();
      };
    }
  }, []);

  return { width, ref };
}

const FavoriteTable = ({ dataSource, removeWatchList }: { dataSource: any; removeWatchList: (code: string) => void }) => {
  const columns = [
    {
      title: "名称",
      key: "name",
      dataIndex: "name",
    },
    {
      title: "代码",
      key: "code",
      dataIndex: "code",
    },
    {
      title: "涨跌",
      key: "percent",
      dataIndex: "percent",
      render: (_, item: any) => {
        return <PercentLabel value={item?.percent || 10} />;
      },
    },
    {
      title: "价格",
      key: "price",
      dataIndex: "price",
      render: (_, item: any) => {
        return <div className="flex items-center gap-2">{item?.price}</div>;
      },
    },
    {
      title: "操作",
      key: "action",
      dataIndex: "action",
      render: (_, item: any) => {
        return (
          <div className="flex items-center gap-2">
            <Trash2 className="size-4 text-red-300 hover:text-red-500" onClick={() => removeWatchList(item.code)} />
          </div>
        );
      },
    },
  ];

  return <Table columns={columns} dataSource={dataSource} rowKey="code" pagination={false} />;
};

// 涨跌% label

const PercentLabel = ({ value }: { value: number }) => {
  return <span className={cn("text-sm text-gray-400", value < 0 ? "text-green-500" : "text-red-500")}>{value}%</span>;
};

export function FavoriteList({ className, onClickItem }: { className?: string; onClickItem: (code: string, type: string) => void }) {
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
  const { width, ref } = useObserverWidthResize();

  return (
    <div id="watch-list" className={cn("flex flex-col w-full h-full overflow-hidden overflow-y-auto ", className)} ref={ref}>
      {width < 350 ? (
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
      ) : (
        <FavoriteTable dataSource={watchList} removeWatchList={removeWatchList} />
      )}
    </div>
  );
}
