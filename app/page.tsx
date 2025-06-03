"use client";

import SimpleCard from "@shadcn/component/card";
import { PackagePlus, Pencil } from "lucide-react";

import { LastOperation, Favorite, EditBatch, EditOne, Plan } from "#components/page-index";

export default function Page() {
  return (
    <div className="flex flex-col h-full w-full">
      <header className="h-12 w-full border-b border-gray-300 flex items-center justify-between px-4">
        <EditOne>
          <Pencil className="cursor-pointer" />
        </EditOne>
        <EditBatch>
          <PackagePlus className="cursor-pointer" />
        </EditBatch>
      </header>
      <main className="flex flex-1 gap-4 p-4 flex-wrap">
        <SimpleCard title="最近操作" className="w-[420px] h-[300px]">
          <LastOperation />
        </SimpleCard>

        <SimpleCard title="自选" className="w-[420px] h-[300px]">
          <Favorite />
        </SimpleCard>

        <SimpleCard title="交易记录" className="w-[420px] h-[300px]">
          <LastOperation  />
        </SimpleCard>

        <SimpleCard title="关注计划" className="w-[550px] h-[300px]">
          <Plan />
        </SimpleCard>
      </main>
    </div>
  );
}
