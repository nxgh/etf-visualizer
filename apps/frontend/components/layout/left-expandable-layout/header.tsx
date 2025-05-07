import { Separator } from "@shadcn/ui/separator";
import { PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { useLayout } from ".";

interface HeaderProps {
  children?: React.ReactNode;
}

export function Header({ children }: HeaderProps) {
  const { isExpanded, setIsExpanded } = useLayout();

  return (
    <header className="sticky top-0 flex shrink-0 items-center gap-2 border-b bg-background p-4">
      {isExpanded ? (
        <PanelLeftClose 
          className="size-4 hover:cursor-pointer hover:text-blue-500 transition-colors" 
          onClick={() => setIsExpanded(false)} 
        />
      ) : (
        <PanelLeftOpen 
          className="size-4 hover:cursor-pointer hover:text-blue-500 transition-colors" 
          onClick={() => setIsExpanded(true)} 
        />
      )}

      <Separator orientation="vertical" className="mr-2 h-4" />
      {children}
    </header>
  );
}