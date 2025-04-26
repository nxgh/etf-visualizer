"use client";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@shadcn/ui/card";

import WatchList from "./watch-list";
import SearchDialog from "./search-dialog";
import { Car } from "lucide-react";

export default function WatchListIndex() {
  return (
    <Card className="h-[600px]">
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
