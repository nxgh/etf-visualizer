import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@shadcn/ui/tooltip";

export default function ToolTipIcon({ children, label }: { children: React.ReactNode; label: string }) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>{children}</TooltipTrigger>
        <TooltipContent>
          <p>{label}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
