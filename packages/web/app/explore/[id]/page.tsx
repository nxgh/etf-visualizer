"use client";

import { use } from "react";
import { ConfigList, ConfigDetail, DetailTransaction } from "../mock";
import { useQueryState } from "nuqs";
import { TransactionTable } from "#components/transaction/table";
import { Tree } from "#shadcn/antd/tree";

export default function ExploreStrategyDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);

  const [s, setId] = useQueryState("s");

  console.log(id, ConfigList, ConfigDetail, DetailTransaction);

  const config = ConfigList.find((item) => item.id === id);
  const detail = ConfigDetail.filter((item) => item.strategy_id === id);

  const transaction = DetailTransaction.filter((item) => item.sourceId === s);

  return (
    <div className="flex gap-2">
      <div className="flex flex-col gap-2 border-r border-gray-200 p-2 m-2">
        {detail.map((item) => (
          <div key={item.id} className="flex items-center  gap-2 border rounded-md p-2 w-[15vw] overflow-auto" onClick={() => setId(item.id)}>
            <div className="text-lg font-bold">{item.name}</div>
            <div className="text-sm text-gray-500">{item.code}</div>
          </div>
        ))}
      </div>
      <div className="flex flex-col gap-2">
        {transaction.map((item) => (
          // <TransactionTable key={item.id} code={item.code} />
          //
          <div key={item.id} className="flex gap-2 border rounded-md p-2 w-[15vw]">
            <div>{item.id}</div>
            <div>{item.code}</div>
            <div>{item.timestamp}</div>
            <div>{item.type}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
