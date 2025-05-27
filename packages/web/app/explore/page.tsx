"use client";

import { Drawer } from "@shadcn/antd/drawer";
import { Badge } from "@shadcn/ui/badge";

import { Shapes, Sparkle, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { useQueryState } from "nuqs";
import { ConfigList } from "./mock";

function ExploreStrategyList() {
  // const [strategy, setStrategy] = useQueryState("s");
  const router = useRouter();

  const onClickStrategy = (id: string) => {
    router.push(`/explore/${id}`);
  };

  return (
    <div className="flex-1 flex flex-wrap overflow-auto justify-center">
      {[...Array(40).keys()]
        .map((i) => (i % 2 === 0 ? ConfigList[0] : ConfigList[1]))
        .map((item, index) => {
          return (
            <div className="w-[22vw] h-[16vh] border border-gray-200 rounded-lg p-4 m-2" key={`${item.id}-${index}`}>
              <div className="flex items-center justify-between cursor-pointer">
                <h2 className="text-lg font-bold" onClick={() => onClickStrategy(item.id)}>
                  {item.title}
                </h2>
                <Sparkles onClick={() => {}} />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex flex-col gap-2">
                  <div>来源：{item.source}</div>
                  <div>主理人：{item.host}</div>

                  <div className="flex flex-wrap gap-2">
                    {item.desc.map((desc, index) => {
                      return <Badge key={`${item.id}-${index}`}>{desc}</Badge>;
                    })}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
    </div>
  );
}

export default function Explore() {
  return (
    <div className="w-full h-full flex flex-col">
      <header className="w-full h-12 border-b flex items-center justify-between px-4">
        <div>
          <span>探索</span>
        </div>
      </header>

      <main className="flex-1 flex flex-wrap overflow-auto justify-center">
        <ExploreStrategyList />
      </main>
    </div>
  );
}
