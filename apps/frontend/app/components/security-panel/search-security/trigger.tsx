import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@shadcn/ui/dialog";

import { useSecurityStore } from "../use-store";

export default function SearchSecurity({ children }: { children: React.ReactNode }) {
  const setSearchData = useSecurityStore((state) => state.setSearchData);

  function onOpenChange(open: boolean) {
    if (!open) {
      setSearchData();
    }
  }

  return (
    <Dialog onOpenChange={onOpenChange}>
      <DialogTrigger>
        <div className="flex items-center gap-2 relative">
          <div className="inline-flex items-center gap-2 whitespace-nowrap transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&amp;_svg]:pointer-events-none [&amp;_svg]:size-4 [&amp;_svg]:shrink-0 border border-input hover:bg-accent hover:text-accent-foreground px-4 py-2 relative h-8 w-full justify-start rounded-[0.5rem] bg-muted/50 text-sm font-normal text-muted-foreground shadow-none sm:pr-12 md:w-40 lg:w-56 xl:w-64">
            <span className="hidden lg:inline-flex">Search Security...</span>
            <span className="inline-flex lg:hidden">Search Security...</span>
            <kbd className="pointer-events-none absolute right-[0.3rem] top-[0.3rem] hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
              <span className="text-xs">⌘</span>K
            </kbd>
          </div>
        </div>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Search Security</DialogTitle>
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  );
}
