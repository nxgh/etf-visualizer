import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription, DialogHeader } from "@shadcn/ui/dialog";
import { Button } from "@shadcn/ui/button";
import { useState } from "react";
import { FavoriteSearchInput } from "./search-input";
import { FavoriteSearchList } from "./search-list";
import { useQueryState } from "nuqs";
import { Search } from "lucide-react";

export function FavoriteSearch() {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useQueryState("q");

  const onOpenChange = (open: boolean) => {
    console.log("open", open);
    if (!open) {
      setQ(null);
    }
    setOpen(open);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <span className="text-sm text-gray-400 border shadow-md bg-gray-100 border-gray-300 rounded-md px-2 py-1 w-[15vw] cursor-pointer flex items-center gap-2">
          <Search size={14} /> Search Favorite ...
        </span>
      </DialogTrigger>
      <DialogContent className="w-[600px] max-w-3xl">
        <DialogHeader>
          <DialogTitle>Add Favorite</DialogTitle>
          <DialogDescription>Add a favorite to your list</DialogDescription>
        </DialogHeader>
        <div className="flex flex-col max-h-[50vh] overflow-y-auto">
          <FavoriteSearchInput className="mb-2 " />
          <FavoriteSearchList />
        </div>
      </DialogContent>
    </Dialog>
  );
}
