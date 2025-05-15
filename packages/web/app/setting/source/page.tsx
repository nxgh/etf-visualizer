"use client";

import { Input, Space, Table, Tag } from "antd";

const { Column, ColumnGroup } = Table;
import type { TableProps } from "antd";
import { Delete } from "lucide-react";

interface DataType {
  key: string;
  name: string;
  age: number;
  address: string;
  tags: string[];
}

const columns: TableProps<DataType>["columns"] = [
  {
    title: "名称",
    dataIndex: "name",
    key: "name",
    render: (text) => <Input value={text} />,
  },
  {
    title: "图标",
    dataIndex: "icon",
    key: "icon",
    render: (text) => <Input value={text} />,
  },
  {
    title: "地址",
    dataIndex: "address",
    key: "address",
    render: (text) => <Input value={text} />,
  },

  {
    title: "Action",
    key: "action",
    render: (_, record) => (
      <Space size="middle">
        <a>
          <Delete className="text-red-500" />
        </a>
      </Space>
    ),
  },
];
const data: DataType[] = [
  {
    key: "1",
    name: "John Brown",
    age: 32,
    address: "New York No. 1 Lake Park",
    tags: ["nice", "developer"],
  },
  {
    key: "2",
    name: "Jim Green",
    age: 42,
    address: "London No. 1 Lake Park",
    tags: ["loser"],
  },
  {
    key: "3",
    name: "Joe Black",
    age: 32,
    address: "Sydney No. 1 Lake Park",
    tags: ["cool", "teacher"],
  },
];

export default function SourceSettingPage() {
  return (
    <div className="w-full px-[20%] py-20">
      <Table<DataType> pagination={false} className="w-full" columns={columns} dataSource={data} />
    </div>
  );
}
