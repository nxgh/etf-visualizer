import WatchList from "#components/watch-list";
import TransactionTable from "#components/transaction";

export default async function Home() {
  return (
    <div className="w-full h-full flex">
      <WatchList />
      <TransactionTable />
    </div>
  );
}
