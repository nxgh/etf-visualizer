"use client";

import { cn } from "@shadcn/lib/utils";
import { Input } from "@shadcn/ui/input";
import { useQueryState } from "nuqs";

export function FavoriteSearchInput({ className }: { className?: string }) {
  const [q, setQuery] = useQueryState("q");
 
  return (
    <Input
      placeholder="Search"
      className={cn("mb-0", className)}
      inputClassName="focus-visible:ring-0 shadow-none"
      value={q ?? ""}
      onChange={(e) => setQuery(e.target.value)}
      clearable
      onClear={() => setQuery(null)}
    />
  );
}
