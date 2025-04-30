import createEnums from "#utils/createEnums";
import { cn } from "@shadcn/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@shadcn/ui/tabs";
import TransactionPresetTable from "./table";
import { Button } from "@shadcn/ui/button";
import Store from "#store";
import { useSearchParams } from "next/navigation";

const TabEnums = createEnums({
  Preset: "Preset",
  Strategy: "Strategy",
  Record: "Record",
});

export function TabsDemo() {
  const sp = useSearchParams();

  const insertEmptyTransaction = Store.use.insert_to_transaction();
  return (
    <div className="flex justify-between">
      <Tabs defaultValue="account" className="w-[400px]">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value={TabEnums.Preset.key}>{TabEnums.Preset.value}</TabsTrigger>
          <TabsTrigger value={TabEnums.Strategy.key}>{TabEnums.Strategy.value}</TabsTrigger>
          <TabsTrigger value={TabEnums.Record.key}>{TabEnums.Record.value}</TabsTrigger>
        </TabsList>

        {/* <TabsContent value={TabEnums.Preset.key}>{TabEnums.Preset.value}</TabsContent>
      <TabsContent value={TabEnums.Strategy.key}>{TabEnums.Strategy.value}</TabsContent>
      <TabsContent value={TabEnums.Record.key}></TabsContent> */}
      </Tabs>

      <div>
        <Button size="sm" className="mr-2" onClick={() => sp.get("code") && insertEmptyTransaction({ code: sp.get("code")! })}>
          添加
        </Button>
        <Button size="sm">导入</Button>
      </div>
    </div>
  );
}

export default function GridTradingCombine({ className }: { className: string }) {
  return (
    <div className={cn("flex flex-col w-full h-full", className)}>
      <TabsDemo />

      <TransactionPresetTable />
    </div>
  );
}
