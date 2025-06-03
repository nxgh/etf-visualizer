"use client";

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@shadcn/ui/dialog";
import { Button } from "@shadcn/ui/button";
import { useState } from "react";
import { Textarea } from "@shadcn/ui/textarea";

export function EditBatch({ children }: { children: React.ReactNode }) {
  const placeholder =
    "# 分割可使用 , 或 | \n# 代码|日期|价格 |数量|分类 \n000001 |2025-05-30|1.200|1000|默认\n000002,2025-05-30,1.131,-1000,默认\n";

  const [text, setText] = useState("");

  function parseText(text: string) {
    try {
      const lines = text.split("\n");

      const data = lines.map((item) => (item.includes(",") ? item.split(",") : item.split("|")));
      // TODO: 校验数据

      return data;
    } catch (error) {
      return null;
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="w-[600px] max-w-3xl">
        <DialogHeader>
          <DialogTitle className="text-xl">批量编辑</DialogTitle>
          <DialogDescription> </DialogDescription>
        </DialogHeader>

        <Textarea placeholder={placeholder} value={text} onChange={(e) => setText(e.target.value)} />

        <DialogFooter>
          <Button
            onClick={() => {
              console.log("text\n", parseText(text));
            }}
          >
            保存
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
