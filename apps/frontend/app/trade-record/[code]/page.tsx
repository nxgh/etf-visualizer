"use client";

import { use } from "react";

export default function TradeRecordPage({ params }: { params: Promise<  { code: string }> }) {
  const resolvedParams = use(params);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">交易记录</h1>
      <div>基金代码：{resolvedParams.code}</div>
    </div>
  );
}