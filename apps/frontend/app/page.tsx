import WatchList from "#components/watch-list";
import TransactionTable from "#components/transaction";

export default async function Home() {
  return (
    <div className="w-full h-full flex">
      <WatchList />

      <div className="h-full flex-1">
        <div className="h-1/2"></div>
        <TransactionTable className="h-1/2" />
      </div>
    </div>
  );
}
