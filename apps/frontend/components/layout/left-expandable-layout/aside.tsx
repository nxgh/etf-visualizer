import { useLayout } from ".";
import { cn } from "@shadcn/lib/utils";

interface AsideProps {
  children: React.ReactNode;
  className?: string;
}

export function Aside({ children, className }: AsideProps) {
  const { isExpanded } = useLayout();

  return (
    <div className={cn("h-full transition-[width,transform] duration-300 overflow-hidden", isExpanded ? "w-[300px]" : "w-0", className)}>
      <div className={cn("w-[300px] h-full transition-transform duration-300 p-4 flex flex-col", isExpanded ? "translate-x-0" : "-translate-x-full")}>
        {children}
      </div>
    </div>
  );
}
