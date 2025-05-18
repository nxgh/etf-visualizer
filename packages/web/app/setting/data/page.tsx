"use client";

import { storage, type StoreState, useStore, Store } from "#stores/use-store";

import { useState, useEffect, useMemo } from "react";
import { Table } from "antd";
import { Input } from "@shadcn/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@shadcn/ui/tabs";
import { parseAsString, useQueryState } from "nuqs";
import { cn } from "@shadcn/lib/utils";
import { useSearchParams } from "next/navigation";
import { Button } from "@shadcn/ui/button";
import { Trash2 } from "lucide-react";
import { syncDataAction } from "#actions/index";

type IDataSource = StoreState[keyof StoreState];

function SettingTable() {
  const [selectedKey, setSelectedKey] = useQueryState("k", parseAsString);

  const dataSource = Store.use[selectedKey as keyof StoreState]() ?? [];

  const columns = useMemo(
    () => [
      ...Object.keys(dataSource[0] ?? {})
        .filter((key) => !["id", "create_at", "update_at"].includes(key))
        .map((key) => ({
          title: key,
          dataIndex: key,
          // key,
          render: (text: string, record: Record<string, any>) => (
            <Input
              disabled={key === "id" || key === "code"}
              value={text}
              onChange={(e) => {
                updateStoreByName(key, e.target.value, record);
              }}
            />
          ),
        })),
      {
        title: "操作",
        render: (text: string, record: Record<string, any>) => (
          <Trash2
            className="text-red-500 cursor-pointer"
            onClick={() => {
              removeStoreById(record.id);
            }}
          />
        ),
      },
    ],
    [dataSource]
  );

  function removeStoreById(id: string) {
    useStore.setState((state) => ({
      [selectedKey as keyof StoreState]: state[selectedKey as keyof StoreState].filter((item) => item.id !== id),
    }));
  }

  // 保存数据;
  function updateStoreByName(key: string, value: string, record: Record<string, any>) {
    useStore.setState((state) => ({
      [selectedKey as keyof StoreState]: state[selectedKey as keyof StoreState].map((item) =>
        item?.id && record?.id ? item?.id === record.id : item.code === record.code ? { ...item, [key]: value } : item
      ),
    }));
  }
  return (
    <Table
      rowKey={(record) => record.id || record.code}
      className="flex-1 m-4"
      dataSource={dataSource as any}
      columns={columns}
      pagination={{
        total: dataSource.length,
      }}
    />
  );
}

export default function DataSettingPage() {
  const data = useStore.getState();
  const keys: (keyof StoreState)[] = Object.keys(data) as (keyof StoreState)[];

  const [selectedKey, setSelectedKey] = useQueryState("k");

  useEffect(() => {
    if (!selectedKey) {
      setSelectedKey(keys[0]);
    }
  }, []);

  async function sync() {
    // const data =
    const res = await syncDataAction(data);
    // todo: add toast
  }

  return (
    <div className="w-full flex">
      <div className="flex flex-col items-center gap-2 w-[250px] border-r border-gray-300 h-full p-2">
        {keys.map((key) => (
          <div
            className={cn(
              "cursor-pointer hover:bg-gray-100 p-2 rounded-md text-lg font-bold  bg-gray-50 w-full text-gray-500 flex items-center justify-center",
              selectedKey === key && "bg-gray-200"
            )}
            key={key}
            onClick={() => setSelectedKey(key)}
          >
            {key}
          </div>
        ))}

        <Button className="w-full" onClick={sync}>
          数据同步
        </Button>
      </div>

      {selectedKey && <SettingTable />}
    </div>
  );
}
