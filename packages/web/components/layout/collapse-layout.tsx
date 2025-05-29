// export { LeftExpandableLayout } from "./left-expandable-layout";
// export { useLayout } from "./left-expandable-layout";
// export { Aside } from "./aside";
// export { Header } from "./header";

import { cn } from "@shadcn/lib/utils";
import { Separator } from "@shadcn/ui/separator";
import { PanelLeftClose, PanelLeftOpen } from "lucide-react";

interface AsideProps {
  children: React.ReactNode;
  className?: string;
  wrapClassName?: string;
}

import * as React from "react";

interface LayoutContextValue {
  isExpanded: boolean;
  setIsExpanded: (value: boolean) => void;
}

const LayoutContext = React.createContext<LayoutContextValue | null>(null);

function useLayout() {
  const context = React.useContext(LayoutContext);
  if (!context) {
    throw new Error("useLayout must be used within a Layout");
  }
  return context;
}

interface CollapseLayoutProps {
  children?: React.ReactNode;
  className?: string;
}

export function CollapseAside({ children, wrapClassName, className }: AsideProps) {
  const { isExpanded } = useLayout();

  return (
    <div className={cn("h-full transition-[width,transform] duration-300 overflow-hidden", isExpanded ? "w-[300px]" : "w-0", wrapClassName)}>
      <div
        className={cn(
          "w-[300px] h-full transition-transform duration-300 flex flex-col",
          isExpanded ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {children}
      </div>
    </div>
  );
}

export function CollapseHeader({ children, className }: CollapseLayoutProps) {
  const { isExpanded, setIsExpanded } = useLayout();

  return (
    <header className={cn("sticky top-0 flex shrink-0 items-center gap-2 border-b bg-background p-4", className)}>
      {isExpanded ? (
        <PanelLeftClose
          className="size-4 hover:cursor-pointer hover:text-blue-500 transition-colors"
          onClick={() => setIsExpanded(false)}
        />
      ) : (
        <PanelLeftOpen className="size-4 hover:cursor-pointer hover:text-blue-500 transition-colors" onClick={() => setIsExpanded(true)} />
      )}

      <Separator orientation="vertical" className="mr-2 h-4" />

      <div className={cn("flex-1", className)}>{children}</div>
    </header>
  );
}

export function CollapseLayoutProvider({ children, className }: CollapseLayoutProps) {
  const [isExpanded, setIsExpanded] = React.useState(true);

  return (
    <LayoutContext.Provider value={{ isExpanded, setIsExpanded }}>
      <div className={cn("w-full h-full flex", className)}>{children}</div>
    </LayoutContext.Provider>
  );
}
