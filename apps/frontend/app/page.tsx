import WatchList from "#components/watch-list";
import TransactionTable from "#components/transaction";
import GridTradingPreset from "#components/grid-trading-preset";

export default async function Home() {
  return (
    <div className="w-full h-full flex">
      <WatchList />

      <div className="h-full flex-1">
        {/* <div className="h-1/2"></div> */}
        <GridTradingPreset className="h-1/2" />
        <TransactionTable className="h-1/2" />
      </div>
    </div>
  );
}
