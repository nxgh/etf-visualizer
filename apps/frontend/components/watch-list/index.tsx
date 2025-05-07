"use client";

import { SimpleIconTooltip } from "@shadcn/component";

import { SimpleList } from "@shadcn/component";
import { DiamondMinus, DiamondPlus, Trash2, FileChartLine, Gem } from "lucide-react";

import Store from "#store";
import { cn } from "@shadcn/lib/utils";
import { Button } from "@shadcn/ui/button";
import { CommandItem } from "@shadcn/ui/command";

import { useSecuritySearch } from "./use-security-search";
import { ScrollArea } from "@shadcn/ui/scroll-area";
import { Match, Switch } from "@shadcn/component/match";
import { useQueryState } from "nuqs";
import { insertWatchList, removeWatchList } from "#store/create-store";
import { useRouter } from "next/navigation";

type ItemType = Pick<IWatchList, "code" | "name" | "type"> & { isFavorite?: boolean };

function WatchList(props: { watchList: IWatchList[]; className?: string }) {
  const [code, setCode] = useQueryState("c");
  const router = useRouter();
  // const [type, setType] = useQueryState("t");

  const handleClickItem = (code: string) => {
    // setCode(code);
    router.push(`/favorite/${code}`);
    // setType(null);
  };

  const icons = [
    {
      name: "交易预设",
      icon: (code: string) => (
        <FileChartLine
          className="size-4 text-blue-200 hover:text-blue-500"
          onClick={() => {
            router.push(`${code}/preset`);
          }}
        />
      ),
    },
    // {
    //   name: "主理人交易记录",
    //   icon: (code: string) => (
    //     <Gem
    //       className="size-4 text-green-200 hover:text-green-500"
    //       onClick={() => {
    //         setCode(code);
    //       }}
    //     />
    //   ),
    // },
  ];

  return (
    <ScrollArea className="h-full rounded-md w-full">
      <div className={cn("h-full flex flex-col overflow-x-hidden overflow-y-auto", props.className)}>
        {props.watchList.map((item) => {
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
                  {icons.map((icon) => (
                    <SimpleIconTooltip key={icon.name} label={icon.name}>
                      {icon.icon(item.code)}
                    </SimpleIconTooltip>
                  ))}
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
  );
}

export default function WatchListIndex({ className }: { className?: string }) {
  // store
  const watchList = Store.use.watchList();

  // hook
  const { showList, loading } = useSecuritySearch();

  // state
  const [q] = useQueryState("q");

  return (
    <div id="watch-list" className={cn("flex flex-col w-full h-full overflow-hidden overflow-y-auto ", className)}>
      <Switch>
        <Match when={q}>
          <SimpleList
            loading={loading}
            emptyContent={<div className="text-sm text-gray-400">No result found</div>}
            className={cn("w-full h-full z-10 bg-transparent backdrop-blur-[14px]")}
            list={showList}
            getKey={(item) => item.code}
          >
            {(item: ItemType) => (
              <CommandItem key={item.code} className="flex items-end justify-between">
                <div className="text-sm flex flex-col  gap-2">
                  <span className="text-base">{item.name}</span>
                  <span className="text-sm text-gray-400">[{item.code}]</span>
                </div>
                {item.isFavorite ? (
                  <Button variant="ghost" size="icon" className="hover:bg-gray-201 rounded-full" onClick={() => removeWatchList(item.code)}>
                    <DiamondMinus className="hover:text-red-501" />
                  </Button>
                ) : (
                  <Button variant="ghost" size="icon" className="hover:bg-gray-201 rounded-full" onClick={() => insertWatchList(item)}>
                    <DiamondPlus className="hover:text-red-501" />
                  </Button>
                )}
              </CommandItem>
            )}
          </SimpleList>
        </Match>

        <Match when={!q}>
          <WatchList watchList={watchList} />
        </Match>
      </Switch>
    </div>
  );
}
