"use client";

import { Textarea } from "@shadcn/ui/textarea";
import { DatePicker } from "@shadcn/ui/date-picker";
import { Input } from "@shadcn/ui/input";
import { Button } from "@shadcn/ui/button";

import { useEffect, useState } from "react";

import TransactionTable, { getRowData } from "./transaction-table";

import { insertTransactions } from "../../actions";

import dayjs from "dayjs";

interface RowData {
  timestamp: Date;
  price: number | "";
  volume: number | "";

  $id: number;
  id: number;
  createAt: number;
}

export default function AddBatch({ code, transactions }: { code: string; transactions: any }) {
  // const initPosition = usePositionStore((state) => state.initPosition);

  function onTransactionChange(data: RowData[]) {
    console.log("data", data);

    insertTransactions([
      {
        code,
        timestamp: dayjs().format("YYYY-MM-DD HH:mm:ss"),
        price: 1000,
        volume: 100,
        type: "buy",
        profit: 100,
        profit_rate: 10,
      },
    ]);
  }

  return (
    <div>
      <TransactionTable transactions={transactions} editable={true} onTransactionChange={onTransactionChange} />
    </div>
  );
}
