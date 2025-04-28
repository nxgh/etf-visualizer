import { Button } from "@shadcn/ui/button";
import { Label } from "@shadcn/ui/label";
import { Input } from "@shadcn/ui/input";

import * as Store from "#store";
import dayjs from "dayjs";
import { useRef } from "react";

function ConfigImportExport() {
  const strategyStore = Store.presetListStore.getState();
  const watchListStore = Store.watchListStore.getState();
  const transactionStore = Store.transactionStore.getState();

  const exportConfig = () => {
    const config = {
      strategy: strategyStore,
      watchList: watchListStore,
      transaction: transactionStore,
    };
    const json = JSON.stringify(config, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Etf-Visualizer-Config-${dayjs().format("YYYYMMDD-HHmmss")}.json`;
    a.click();
  };

  const importConfig = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.readAsText(file);
      reader.onload = () => {
        const json = JSON.parse(reader.result as string);
        console.log(json);
      };
    }
  };

  const inputRef = useRef<HTMLInputElement>(null);

  const handleImport = () => {
    inputRef.current?.click();
  };

  return (
    <div>
      <div className="grid w-full max-w-sm items-center gap-1.5">
        <Label htmlFor="picture">
          <Button onClick={handleImport}>Import</Button>
        </Label>
        <Input id="picture" type="file" className="hidden" ref={inputRef} onChange={importConfig} />
      </div>

      <Button onClick={exportConfig}>Export</Button>
    </div>
  );
}

export default ConfigImportExport;
