"use client";

import { GridLayout } from "#components/grid-layout";
import { useQueryState } from "nuqs";
import { FavoriteList } from "#components/favorite/favorite-list";

import { layoutStoreAction, useLayoutFilterByIds } from "#stores/modules/layout";
import { TransactionTable } from "#components/transaction/table";
import { transactionStoreAction } from "#stores/modules/transaction";
const defaultLayout = [
  { w: 10, h: 11, x: 0, y: 0, i: "favorite-list", moved: false, static: true },
  { w: 13, h: 11, x: 10, y: 0, i: "favorite-kline", moved: false, static: true },
  { w: 23, h: 8, x: 0, y: 11, i: "favorite-transaction", moved: false, static: true },
];

export default function FavoritePage({ params }: { params: Promise<{ code: string }> }) {
  const [code, setCode] = useQueryState("code");

  const layout = useLayoutFilterByIds(["favorite-list", "favorite-kline", "favorite-transaction"]);
  const insertLayout = layoutStoreAction.use.insert();
  const updateLayout = layoutStoreAction.use.update();
  const initLayout = layoutStoreAction.use.init();

  const dataSource = transactionStoreAction.use.transaction();
  const insertTransaction = transactionStoreAction.use.insert();
  const updateTransaction = transactionStoreAction.use.update();
  const removeTransaction = transactionStoreAction.use.remove();

  if (layout.length === 0) {
    initLayout(defaultLayout);
  }

  function handleGridLayoutChange(item: ReactGridLayout.Layout[]) {
    updateLayout(item);
  }

  // }
  return (
    <GridLayout
      className="layout h-full w-full"
      layout={layout}
      cols={24}
      width={window?.innerWidth - 50}
      onDragStop={(item) => {
        handleGridLayoutChange(item);
      }}
      onResizeStop={(item) => {
        handleGridLayoutChange(item);
      }}
    >
      <div className="border border-gray-100 rounded-sm w-[100px] h-[100px]" key="favorite-list">
        <FavoriteList
          onClickItem={(code, type) => {
            setCode(code);
          }}
        />
      </div>
      <div className="border border-gray-100 rounded-sm w-[100px] h-[100px]" key="favorite-kline">
        {JSON.stringify(layout)}
      </div>
      <div className="border border-gray-100 rounded-sm w-[100px] h-[100px]" key="favorite-transaction">
        <TransactionTable
          code={code ?? undefined}
          dataSource={dataSource}
          insertTransaction={insertTransaction}
          removeTransaction={removeTransaction}
          updateTransaction={updateTransaction}
          onChange={(item) => {
            console.log(item);
          }}
        />
      </div>
    </GridLayout>
  );
}
