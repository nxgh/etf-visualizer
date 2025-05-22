import { TransactionTable } from "#components/transaction/table";
import { use } from "react";

export default function FavoritePage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = use(params);

  return (
    <div>
      <TransactionTable code={code as string} />
      {/* <TransactionChart code={code as string} /> */}
    </div>
  );
}
