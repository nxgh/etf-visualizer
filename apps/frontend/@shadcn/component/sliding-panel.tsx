import * as React from "react";
import { cn } from "@shadcn/lib/utils";
import { Button } from "@shadcn/ui/button";

interface SlidingPanelContextValue {
  isExpanded: boolean;
  setIsExpanded: (value: boolean) => void;
  width: number;
}

const SlidingPanelContext = React.createContext<SlidingPanelContextValue | null>(null);

function useSlidingPanelContext() {
  const context = React.useContext(SlidingPanelContext);
  if (!context) {
    throw new Error("useSlidingPanelContext must be used within a SlidingPanel");
  }
  return context;
}

interface SlidingPanelProps {
  children: React.ReactNode;
  width?: number;
  className?: string;
  defaultExpanded?: boolean;
}

function SlidingPanel({ children, width = 300, className, defaultExpanded = false }: SlidingPanelProps) {
  const [isExpanded, setIsExpanded] = React.useState(defaultExpanded);
  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsExpanded(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <SlidingPanelContext.Provider value={{ isExpanded, setIsExpanded, width }}>
      <div
        className={cn(
          "relative overflow-hidden h-full w-full transition-[padding] duration-300",
          isExpanded ? "delay-100" : "delay-200",
          className
        )}
        style={{ paddingRight: isExpanded ? `${width}px` : "0" }}
        ref={containerRef}
      >
        {children}
      </div>
    </SlidingPanelContext.Provider>
  );
}

interface TriggerProps {
  children: React.ReactNode;
  className?: string;
}

function SlidingPanelTrigger({ children, ...props }: TriggerProps) {
  const { isExpanded, setIsExpanded } = useSlidingPanelContext();

  return (
    <span
      className={cn(
        "inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors m-1 p-1",
        props.className
      )}
      {...props}
      onClick={() => setIsExpanded(!isExpanded)}
    >
      {children}
    </span>
  );
}

interface SlidingPanelContentProps {
  children: React.ReactNode;
  className?: string;
}

function SlidingPanelContent({ children, className, ...props }: SlidingPanelContentProps) {
  const { isExpanded, width } = useSlidingPanelContext();

  return (
    <div
      style={{ width: `${width}px` }}
      className={cn(
        "absolute top-0 right-0 h-full bg-background shadow-lg transition-transform duration-300 transform",
        isExpanded ? "translate-x-0 delay-0" : "translate-x-full delay-200",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export { SlidingPanel, SlidingPanelTrigger, SlidingPanelContent };
