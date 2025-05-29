import { ConfigProvider, Tree } from "antd";
import { Folder, ChevronDown, TableProperties } from "lucide-react";
import type { GetProps, TreeDataNode } from "antd";
import { cn } from "@shadcn/lib/utils";
import type { TreeProps } from "antd/es/tree";
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from "@shadcn/ui/context-menu";

import "./menu-tree.css";
type DirectoryTreeProps = GetProps<typeof Tree.DirectoryTree>;

const { DirectoryTree } = Tree;

const _treeData: TreeDataNode[] = [
  {
    title: "parent 0",
    key: "0-0",
    children: [
      { title: "leaf 0-0", key: "0-0-0", isLeaf: true },
      { title: "leaf 0-1", key: "0-0-1", isLeaf: true },
    ],
  },
  {
    title: "parent 1",
    key: "0-1",
    children: [
      { title: "leaf 1-0", key: "0-1-0", isLeaf: true },
      { title: "leaf 1-1", key: "0-1-1", isLeaf: true },
    ],
  },
];

export function MenuTree({
  treeData = _treeData,
  className,
  ...props
}: {
  treeData: TreeDataNode[];
  className?: string;
} & DirectoryTreeProps) {
  const data = treeData.map((item) => ({
    ...item,
    icon: <Folder size={18} className="text-blue-500" />,
    children: item.children?.map((child) => ({
      ...child,
      icon: <TableProperties size={18} className="text-green-300" />,
    })),
  }));

  return (
    <ConfigProvider
      theme={{
        token: {
          fontSize: 18,
          colorBgContainer: "#f8f8f8",
        },
        components: {
          Tree: {
            nodeHoverBg: "#e5e6f170",
            nodeSelectedBg: "#e5e6f170",
            directoryNodeSelectedBg: "#e5e6f170",
            directoryNodeSelectedColor: "#000",
            nodeHoverColor: "green",
            nodeSelectedColor: "green",
          },
        },
      }}
    >
      <DirectoryTree
        showLine
        defaultExpandAll
        blockNode
        treeData={data}
        className={cn("menu-tree", className)}
        switcherIcon={<ChevronDown size={18} />}
        titleRender={(node) => {
          return (
            <ContextMenu>
              <ContextMenuTrigger>
                <div className="items-center gap-2 flex-1">{node.title as string}</div>
              </ContextMenuTrigger>
              <ContextMenuContent>
                <ContextMenuItem>添加</ContextMenuItem>
                <ContextMenuItem className="text-red-300 hover:text-red-500">删除</ContextMenuItem>
                <ContextMenuItem>修改</ContextMenuItem>
              </ContextMenuContent>
            </ContextMenu>
          );
        }}
        {...props}
      />
    </ConfigProvider>
  );
}
