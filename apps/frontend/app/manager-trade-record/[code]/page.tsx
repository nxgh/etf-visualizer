// "use client";

import { use } from "react";

import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "主理人交易记录",
    description: "主理人交易记录",
  };
}

function ManagerTradeRecordPage({ params }: { params: Promise<{ code: string }> }) {
  const resolvedParams = use(params);

  return <div className="p-4"></div>;
}

export default ManagerTradeRecordPage;
