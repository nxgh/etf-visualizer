"use client";

import { getColumns } from "#components/grid-trading-preset/strategy-preset-columns";
import TransactionPresetSetting from "#components/trade-preset/strategy-config";
import { IGridLevelRecord } from "#store";
import { SimpleTable } from "@shadcn/component";
import Combobox from "@shadcn/component/combobox";
import { SlidingPanel, SlidingPanelTrigger, SlidingPanelContent } from "@shadcn/component/sliding-panel";
import { Button } from "@shadcn/ui/button";
import { Cog } from "lucide-react";
import { use } from "react";

export default function TradePresetPage({ params }: { params: Promise<{ code: string }> }) {
  const resolvedParams = use(params);

  const onTableChange = (item: IGridLevelRecord, key: keyof IGridLevelRecord, value: string) => {};

  const columns = [
    ...getColumns(onTableChange),
    {
      label: "操作",
      key: "action" as const,
      render: (item: IGridLevelRecord) => (
        <Button variant="destructive" onClick={() => {}}>
          删除
        </Button>
      ),
    },
  ];

  return (
    <div className="p-4 flex-1">
      <SlidingPanel width={250}>
        <SlidingPanelTrigger>
          <Cog className="size-4 text-blue-200  hover:text-blue-500 hover:cursor-pointer" />
        </SlidingPanelTrigger>
        <SlidingPanelContent>
          <TransactionPresetSetting className="p-4" />
        </SlidingPanelContent>
        <Combobox />

        <SimpleTable columns={columns} data={[]} />
      </SlidingPanel>
    </div>
  );
}
