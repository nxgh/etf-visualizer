"use client";

import { TransactionTable } from "#components/transaction/table";
import createEnums, { type GetCreateEnumsKeyType } from "#utils/createEnums";
import { Model } from "@shadcn/antd/model";
import { SimpleCard } from "@shadcn/component";
import { cn } from "@shadcn/lib/utils";
import { Button } from "@shadcn/ui/button";
import { Plus, ReceiptSwissFranc } from "lucide-react";
import { use, useState } from "react";

const RecordTypeEnums = createEnums({
  0: "全部",
  1: "我的",
  2: "主理人",
} as const);

type RecordKeyType = GetCreateEnumsKeyType<typeof RecordTypeEnums>;

const RecordTypeColorMap = {
  0: "text-purple-500",
  1: "text-sky-500",
  2: "text-amber-500",
} as const;

export default function FavoritePage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = use(params);

  const [recordType, setRecordType] = useState<RecordKeyType>(RecordTypeEnums[1].key);

  const switchRecordType = () => {
    // 在0、1、2之间循环切换
    const nextType = (Number(recordType) + 1) % 3;
    setRecordType(nextType as RecordKeyType);
  };

  return (
    <div>
      <SimpleCard
        title={
          <div className="flex justify-between items-center">
            <span className={cn("flex items-center gap-2 cursor-pointer", RecordTypeColorMap[recordType])} onClick={switchRecordType}>
              <ReceiptSwissFranc />
              {RecordTypeEnums[recordType].value}
            </span>
            <span className="flex items-center gap-2 cursor-pointer">
              <Plus />
              <span>添加</span>
            </span>
          </div>
        }
      >
        <TransactionTable code={code as string} editable={false} />

        <Model open={true} onCancel={() => {}}>
          <div>
            <h1>添加</h1>
          </div>
        </Model>
      </SimpleCard>
    </div>
  );
}
