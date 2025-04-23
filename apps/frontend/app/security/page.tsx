"use client";
import { useQueryState } from "nuqs";
import { useState } from "react";

import { Button } from "@shadcn/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
  DrawerPortal,
  DrawerOverlay,
} from "@shadcn/ui/drawer";

import AddBatch from "#components/operation/add-batch";
export default function Page() {
  const [code] = useQueryState("code");
  const [open, setOpen] = useState(false);

  return (
    <div className="container mx-auto px-4 py-8">
      {code}

      <Button> 压力测试 </Button>
      <Button onClick={() => setOpen(true)}> 交易记录 </Button>

      <Drawer direction="right" open={open} onOpenChange={setOpen}>
        {/* <DrawerTrigger> </DrawerTrigger> */}
        <DrawerPortal>
          <DrawerOverlay className="fixed inset-0 bg-black/40" />
          <DrawerContent className="mt-0 right-0 left-auto top-0 w-[600px]">
            <div className="bg-zinc-50 h-full w-full grow p-5 flex flex-col rounded-[16px]">
              <div className="max-w-md mx-auto">
                <DrawerTitle className="font-medium mb-2 text-zinc-900">It supports all directions.</DrawerTitle>
                <DrawerDescription className="text-zinc-600 mb-2">
                  {/* This one specifically is not touching the edge of the screen, but that&apos;s not required for a side drawer. */}
                </DrawerDescription>
                
                <AddBatch />
              </div>
            </div>
          </DrawerContent>
        </DrawerPortal>
      </Drawer>
    </div>
  );
}
