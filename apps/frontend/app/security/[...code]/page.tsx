import { Button } from "@shadcn/ui/button";

import TransactionInfo from "./components/transaction-info";
import { queryTransactions } from "./actions";
import { unstable_cache } from "next/cache";

export function getTransactions(code: string) {
  return unstable_cache(async () => await queryTransactions(code), ["wtf"])();
}

export default async function Page({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;



  // console.log(transactions);

  return (
    <div className="container mx-auto px-4 py-8 h-full ">
      <div className="h-2/3 border-b p-2">{code}</div>
      <div className="h-1/3 p-2 overflow-auto">
        <TransactionInfo code={code}  />
      </div>
    </div>
  );
}
