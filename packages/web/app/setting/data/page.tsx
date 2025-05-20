"use client";

import { SimpleCard } from "@shadcn/component";
import { SimpleTabs } from "@shadcn/component/tabs";
import { Button } from "@shadcn/ui/button";
import { Table } from "antd";
import { BookDown, BookUp, FolderDown, FolderSync, FolderUp } from "lucide-react";
import { useState } from "react";

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
    <div className="w-full h-full flex flex-col">
      <header className="w-full h-12 flex items-center justify-between mb-4 border-b border-gray-300 px-4">
        <span className="text-lg font-bold">Data Management</span>
        <div className="flex items-center gap-2">
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
        </div>
      </header>

      <main className="w-full h-full flex flex-col py-2 px-4">
        <SimpleTabs
          tabs={[
            { label: "Import", content: <div>Import</div> },
            { label: "Export", content: <div>Export</div> },
          ]}
        />

        <div className="w-full h-full flex flex-col ">
          <Table columns={columns} dataSource={data} />
        </div>
      </main>
    </div>
  );
}
