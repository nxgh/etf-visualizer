"use client";

import { getSecurityDetailAction } from "#actions/index";
import { TransactionTable } from "#components/transaction/table";
import createEnums, { type GetCreateEnumsKeyType } from "#utils/createEnums";
import { Model } from "@shadcn/antd/model";
import { SimpleCard } from "@shadcn/component";
import { cn } from "@shadcn/lib/utils";
import { Button } from "@shadcn/ui/button";
import { Plus, ReceiptSwissFranc } from "lucide-react";
import { use, useEffect, useState } from "react";

import { storage } from "#stores/core";

import { GridLayout } from "#components/grid-layout";
import WatchListIndex from "#components/watch-list";
import { WatchListSearch } from "#components/watch-list/search";
import { Separator } from "@radix-ui/react-select";
import { useQueryState } from "nuqs";
import { FavoriteList } from "#components/favorite/favorite-list";

import { layoutStoreAction } from "#stores/modules/layout";

const defaultLayout = [
  {
    w: 10,
    h: 11,
    x: 0,
    y: 0,
    i: "a",
    moved: false,
    static: false,
  },
  {
    w: 13,
    h: 11,
    x: 10,
    y: 0,
    i: "b",
    moved: false,
    static: false,
  },
  {
    w: 18,
    h: 12,
    x: 2,
    y: 11,
    i: "c",
    moved: false,
    static: false,
  },
];

export default function FavoritePage({ params }: { params: Promise<{ code: string }> }) {
  const [code, setCode] = useQueryState("code");

  const layout = layoutStoreAction.use.layout();
  const insertLayout = layoutStoreAction.use.insert();
  const updateLayout = layoutStoreAction.use.update();

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (!layout?.favorite) {
      insertLayout({
        favorite: defaultLayout,
      });
    }
  }, []);

  function handleGridLayoutChange(item: ReactGridLayout.Layout[]) {
    updateLayout({
      favorite: item,
    });
  }

  // }
  return (
    <GridLayout
      className="layout h-full w-full"
      layout={layout?.favorite}
      cols={24}
      width={window?.innerWidth - 50}
      onDragStop={(item) => {
        handleGridLayoutChange(item);
      }}
      onResizeStop={(item) => {
        handleGridLayoutChange(item);
      }}
    >
      <div className="border border-gray-100 rounded-sm w-[100px] h-[100px]" key="a">
        <FavoriteList
          onClickItem={(code, type) => {
            setCode(code);
          }}
        />
      </div>
      <div className="border border-gray-100 rounded-sm w-[100px] h-[100px]" key="b">
        b
      </div>
      <div className="border border-gray-100 rounded-sm w-[100px] h-[100px]" key="c">
        c
      </div>
    </GridLayout>
  );
}
