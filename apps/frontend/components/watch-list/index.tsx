"use client";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@shadcn/ui/card";

import WatchList from "./watch-list";
import SearchDialog from "./search-dialog";
import { cn } from "@shadcn/lib/utils";

export default function WatchListIndex({ className }: { className?: string }) {
  return (
    <Card className={cn("h-[600px]", className)}>
      <CardHeader>
        <CardTitle>Watch List</CardTitle>
      </CardHeader>
      <CardContent>
        <SearchDialog />
        <WatchList />
      </CardContent>
    </Card>
  );
}
