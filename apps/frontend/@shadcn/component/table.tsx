import { cn } from "@shadcn/lib/utils";
import { get } from "lodash-es";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@shadcn/ui/table";

interface SimpleTableProps {
  columns: {
    label: string;
    key: string;
    render?: (data: any, index: number) => React.ReactNode;
    headerRender?: () => React.ReactNode;
    className?: string;
    headerClassName?: string;
    cellClassName?: string;
  }[];
  data: unknown[];
  className?: string;
}

export function SimpleTableHeader({ columns }: { columns: SimpleTableProps["columns"] }) {
  return (
    <TableHeader>
      <TableRow>
        {columns.map((column) => (
          <TableHead key={column.key} className={cn(column?.headerClassName)}>
            {column.headerRender ? column.headerRender() : column.label}
          </TableHead>
        ))}
      </TableRow>
    </TableHeader>
  );
}

export function SimpleTableBody({ columns, data }: SimpleTableProps) {
  return (
    <TableBody>
      {data.map((item, index) => (
        <TableRow key={get(item, "id", index)}>
          {columns.map((column) => (
            <TableCell key={column.key} className={cn(column?.cellClassName)}>
              {column.render ? column.render(item, index) : (item as any)[column.key]}
            </TableCell>
          ))}
        </TableRow>
      ))}
    </TableBody>
  );
}

export default function SimpleTable({ columns, data, className }: SimpleTableProps) {
  return (
    <Table className={cn("w-full h-full", className)}>
      <SimpleTableHeader columns={columns} />
      <SimpleTableBody columns={columns} data={data} />
    </Table>
  );
}

export { Table, TableHeader, TableBody, TableHead, TableRow, TableCell, SimpleTable };
