import { cn } from "@shadcn/lib/utils";
import ReactGridLayout from "react-grid-layout";

import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";

export function GridLayout({ children, className, ...props }: ReactGridLayout.ReactGridLayoutProps) {
  return (
    <ReactGridLayout className={cn("h-full", className)} layout={[]} cols={12} rowHeight={30} {...props}>
      {children}
    </ReactGridLayout>
  );
}
