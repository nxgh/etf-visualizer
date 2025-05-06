"use client";

import { columnEnums, getColumns } from "#components/grid-trading-preset/strategy-preset-columns";
import TransactionPresetSetting, { usePresetSetting } from "#components/trade-preset/strategy-config";
import Store, { generateGrid, IGridLevelRecord } from "#store";
import { SimpleTable } from "@shadcn/component";
import Combobox from "@shadcn/component/combobox";
import { SlidingPanel, SlidingPanelTrigger, SlidingPanelContent } from "@shadcn/component/sliding-panel";
import { Button } from "@shadcn/ui/button";
import { Cog } from "lucide-react";
import { use, useMemo, useState } from "react";

export default function TradePresetPage({ params }: { params: Promise<{ code: string }> }) {
  // store
  const strategyStore = Store.use.presetList();

  // hook
  const resolvedParams = use(params);
  const { form, saveForm, updateForm } = usePresetSetting();

  const list = useMemo(() => {
    return strategyStore
      .filter((item) => item.code === resolvedParams.code)
      .map((item) => ({
        value: item.id,
        label: item.strategyName,
      }));
  }, [resolvedParams.code, strategyStore]);

  // state
  const onTableChange = (item: IGridLevelRecord, key: keyof IGridLevelRecord, value: string) => {};

  const dataSource = useMemo(() => {
    return generateGrid(form);
  }, [form]);

  // methods

  const columns = [
    ...getColumns(onTableChange).filter((item) => ![columnEnums.buyDate.key, columnEnums.sellDate.key].includes(item.key as any)),
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
        <Combobox list={list} />

        <SimpleTable columns={columns} data={dataSource} />
      </SlidingPanel>
    </div>
  );
}
