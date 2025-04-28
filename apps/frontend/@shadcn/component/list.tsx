import { cn } from "@shadcn/lib/utils";
import { Command, CommandList, CommandGroup, CommandItem, CommandSeparator } from "@shadcn/ui/command";
import { type ReactNode, Fragment } from "react";

interface IProps<T> {
  list: { groupName: string; items: T[] }[] | T[];
  children: (item: T) => ReactNode;
  emptyContent?: ReactNode;
  getKey?: (item: T) => string | number; // Add key extractor prop
  className?: string;
}

export default function SimpleList<T>(props: IProps<T>) {
  const { list, children, emptyContent, getKey = (item: T) => JSON.stringify(item) } = props;
  return (
    <Command className={cn(props.className)}>
      <CommandList className="h-full">
        {list.length === 0 && emptyContent}
        {list.map((listItem, index) => {
          // 添加类型守卫函数
          const isGroupItem = (item: unknown): item is { groupName: string; items: T[] } => {
            return (
              typeof item === "object" &&
              item !== null &&
              "groupName" in item &&
              "items" in item &&
              Array.isArray((item as { items: unknown }).items)
            );
          };

          if (isGroupItem(listItem)) {
            const { groupName, items } = listItem;
            return (
              <CommandGroup key={groupName} heading={groupName}>
                {items.map((item) => (
                  <Fragment key={getKey(item)}>{children(item)}</Fragment>
                ))}
              </CommandGroup>
            );
          }

          return <Fragment key={getKey(listItem as T)}>{children(listItem as T)}</Fragment>;
        })}
      </CommandList>
    </Command>
  );
}
