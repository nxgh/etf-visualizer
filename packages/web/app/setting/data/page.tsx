"use client";

import { SimpleCard } from "@shadcn/component";
import { SimpleTabs } from "@shadcn/component/tabs";
import { Button } from "@shadcn/ui/button";
import { Table } from "antd";
import { BookDown, BookUp, FolderDown, FolderSync, FolderUp, Plus } from "lucide-react";
import { useState } from "react";
import { CreateTableDialog } from "./create-table";
import { MenuTree } from "./menu-tree";
import { CollapseAside, CollapseHeader, CollapseLayoutProvider } from "#components/layout/collapse-layout";



export default function SettingDataPage() {
  const [data, setData] = useState([
    {
      id: "1",
      name: "John Doe",
      email: "john.doe@example.com",
      phone: "1234567890",
      address: "123 Main St, Anytown, USA",
      city: "Anytown",
      state: "CA",
      key: "1",
    },
  ]);
  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "Address",
      dataIndex: "address",
      key: "address",
    },
    {
      title: "City",
      dataIndex: "city",
      key: "city",
    },
  ];

  return (
    <CollapseLayoutProvider>
      <CollapseAside wrapClassName="border-r border-gray-200 bg-[#f8f8f8]">
        <header className="flex items-center gap-2 border-b border-gray-200 p-2 mb-4">
          <CreateTableDialog>
            <Plus className="size-6 cursor-pointer" />
          </CreateTableDialog>
        </header>
        <div className="w-full flex flex-1 pl-2">
          <MenuTree className="w-full"  />
        </div>
      </CollapseAside>

      <main className="flex-1 h-full flex flex-col py-2 px-4">
        <CollapseHeader>
          <span className="text-lg font-bold">Data Management</span>
          {/* <div className="inline-flex items-center gap-2">
            <Button size="sm">
              <FolderDown className="size-4" />
              Import
            </Button>
            <Button size="sm" variant="outline">
              <FolderUp className="size-4" />
              Export
            </Button>
            <Button size="sm" variant="outline">
              <BookUp className="size-4" />
              Push
            </Button>
            <Button size="sm" variant="outline">
              <BookDown className="size-4" />
              Pull
            </Button>
          </div> */}
        </CollapseHeader>
        {/* <SimpleTabs
          tabs={[
            { label: "Import", content: <div>Import</div> },
            { label: "Export", content: <div>Export</div> },
          ]}
        /> */}

        <div className="w-full h-full flex flex-col ">
          <Table size="small" columns={columns} dataSource={data} />
        </div>
      </main>
    </CollapseLayoutProvider>
  );
}
