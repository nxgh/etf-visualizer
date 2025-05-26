import { cn } from "@shadcn/lib/utils";
import { Table as AntdTable, ConfigProvider } from "antd";

import type { TableProps } from "antd";

export function Table<T>({ ...props }: TableProps<T>) {
  return (
    <ConfigProvider
      theme={{
        components: {
          Table: {
            headerBg: "transparent",
            headerSplitColor: "transparent",
          },
        },
      }}
    >
      <AntdTable<T> {...props} className={cn("w-full h-full", props.className)} />
    </ConfigProvider>
  );
}
