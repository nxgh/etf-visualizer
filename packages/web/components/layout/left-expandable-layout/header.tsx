import { Separator } from "@shadcn/ui/separator";
import { PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { useLayout } from ".";
import { cn } from "@shadcn/lib/utils";

interface HeaderProps {
  children?: React.ReactNode;
  className?: string;
}

export function Header({ children, className }: HeaderProps) {
  const { isExpanded, setIsExpanded } = useLayout();

  return (
    <header className={cn("sticky top-0 flex shrink-0 items-center gap-2 border-b bg-background p-4")}>
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
