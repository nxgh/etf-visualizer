import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription } from "@shadcn/ui/dialog";
import { Tree } from "@shadcn/antd/tree";
import SimpleDialog from "@shadcn/component/dialog";
import { Button } from "@shadcn/ui/button";
import { DialogHeader, DialogFooter } from "@shadcn/ui/dialog";
import type { TreeDataNode } from "antd";
import { Columns3, Folder, ChevronDown } from "lucide-react";

import { useMemo, useState } from "react";
import { MenuTree } from "./menu-tree";
import { Input } from "@shadcn/ui/input";
import { configStoreAction } from "#stores/modules/config";
import Show from "@shadcn/component/show";
import { SimpleSelect } from "@shadcn/component";
import type { TreeProps } from "antd/es/tree";

// export default App;

const _treeData = [
  {
    title: "table-name",
    key: "TN9910123870410273",
    desc: "table-desc",
    children: [
      { title: "column-name-a", key: "CN9910123870410273", isLeaf: true },
      { title: "column-name-b", key: "CN9910123870410274", isLeaf: true },
    ],
  },
];

const expandKeys = ["TN9910123870410273", "CN9910123870410274", "CN9910123870410273"];

const DataType = [
  { label: "字符串 String", value: "string" },
  { label: "数字 Number", value: "number" },
  { label: "布尔 Boolean", value: "boolean" },
  { label: "数组 Array", value: "array" },
  { label: "对象 Object", value: "object" },
  { label: "日期 Date", value: "date" },
  { label: "浮点 Float", value: "float" },
  { label: "大整数 BigInt", value: "bigint" },
];

const mockData = {
  name: {
    name: "name",
    type: "string",
    desc: "name",
  },
};

export function CreateTableDialog({ children }: { children: React.ReactNode }) {
  //   const createTableName = configStoreAction.use.createTableName();
  //
  const [data, setData] = useState<typeof mockData>(mockData);

  const [tableName, setTableName] = useState("");
  const [config, setConfig] = useState<string[] | null>(null);
  const [form, setForm] = useState<{ name: string; desc: string; type: string | null }>({
    name: "",
    desc: "",
    type: "",
  });

  function createTable() {
    setConfig([]);
  }

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="w-[600px] max-w-3xl">
        <DialogHeader>
          <DialogTitle className="text-xl">Create Table</DialogTitle>
          <DialogDescription> </DialogDescription>
        </DialogHeader>
        {/* <MenuTree /> */}

        <Show when={!config}>
          <Input placeholder="Table Name" value={tableName} onChange={(e) => setTableName(e.target.value)} />
        </Show>

        <Show when={config}>
          <div className="flex w-full h-full min-h-[300px]">
            <aside className="w-[30%]">
              <MenuTree
                style={{ "--ant-tree-switcher-display": "none" } as React.CSSProperties}
                className="h-full"
                treeData={_treeData}
                expandAction={false}
                showLine={false}
                switcherIcon={null}
                onSelect={(keys, info) => {
                  console.log(keys, info);
                  if (keys[0]?.toString().startsWith("TN")) {
                    const node = info.node as unknown as { title: string; desc: string; type: string };
                    setForm({
                      name: node.title,
                      desc: node.desc,
                      type: null,
                    });
                  } else {
                    const node = info.node as unknown as { title: string; desc: string; type: string };
                    setForm({
                      name: node.title,
                      desc: node.desc,
                      type: node.type,
                    });
                  }
                }}
              />
            </aside>

            <div className="flex flex-col gap-2  flex-1 px-4">
              <label className="text-sm font-medium" htmlFor="name">
                <span className="text-red-500">*</span> 名称
              </label>
              <Input placeholder="Table Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              <label className="text-sm font-medium" htmlFor="name">
                描述
              </label>
              <Input placeholder="Table Name" value={form.desc} onChange={(e) => setForm({ ...form, desc: e.target.value })} />
              <label className="text-sm font-medium" htmlFor="name">
                数据类型
              </label>
              {/* <Input placeholder="Table Name" value={name} onChange={(e) => setName(e.target.value)} /> */}

              <Show when={form.type !== null}>
                <SimpleSelect options={DataType} value={form.type} onValueChange={(e) => setForm({ ...form, type: e })} />
              </Show>
            </div>
          </div>
        </Show>

        <DialogFooter>
          <Button disabled={!tableName} onClick={createTable}>
            Create
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
