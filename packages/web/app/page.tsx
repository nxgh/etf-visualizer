import SimpleCard from "@shadcn/component/card";
import { cn } from "@shadcn/lib/utils";
import { Pencil } from "lucide-react";

const lastOperation = [
  { id: 1, date: "2025-05-30", name: "证券AAAA", price: 100, amount: 100, code: "000001" },
  { id: 2, date: "2025-05-30", name: "证券BBBB", price: 100, amount: -120, code: "000001" },
  { id: 3, date: "2025-05-30", name: "证券AAAAA", price: 100, amount: -120, code: "000001" },
  { id: 4, date: "2025-05-30", name: "证券CCCC", price: 100, amount: -120, code: "000001" },
  { id: 5, date: "2025-05-30", name: "证券DDDD", price: 100, amount: 100, code: "000001" },
  { id: 6, date: "2025-05-30", name: "证券FFFF", price: 100, amount: 100, code: "000001" },
];

const favorite = [
  { id: 1, name: "证券AAAA", symbol: "SZ000001", price: 1.231 },
  { id: 2, name: "证券BBBB", symbol: "SZ000002", price: 1.232 },
  { id: 3, name: "证券CCCC", symbol: "SZ000003", price: 1.233 },
];

interface FavoriteProps {
  data: {
    id: number;
    name: string;
    symbol: string;
    price: number;
  }[];
}
interface LastOperation {
  data: {
    id: number;
    date: string;
    name: string;
    price: number;
    amount: number;
    code: string;
    profit?: number;
    profitRate?: number;
  }[];
}

function LastOperation({ data }: LastOperation) {
  return (
    <div>
      {data.map((item) => (
        <div key={item.id} className="flex items-center justify-between">
          <div>{item.date}</div>
          <div>
            {item.name}[{item.code}]
          </div>
          <div className={cn(item.amount > 0 ? "text-green-500" : "text-red-500")}>{item.amount > 0 ? "买入" : "卖出"}</div>
          <div>{item.price}</div>
          <div>{item.amount}</div>
          <div>{item.amount * item.price}</div>
          <div>{item?.profit ?? ""}</div>
          <div>{item?.profitRate ?? ""}</div>
        </div>
      ))}
    </div>
  );
}

function Favorite({ data }: FavoriteProps) {
  return (
    <div>
      {data.map((item) => (
        <div key={item.id} className="flex items-center gap-2">
          <div>{item.name}</div>
          <div>{item.symbol}</div>
          <div>{item.price}</div>
        </div>
      ))}
    </div>
  );
}

interface StrategyProps {
  data: {
    id: number;
    // 策略名称
    name: string;
    symbol: string;
    // 当前价格
    price: number;
    // 止损价格
    stopLossPrice: number;
    // 止盈价格
    takeProfitPrice: number;
    // 买入价格
    buyPrice: number;
    // 卖出价格
    sellPrice: number;
  }[];
}

function Strategy({ data }: StrategyProps) {
  return (
    <div>
      {data.map((item) => {
        const prices = [
          { price: item.stopLossPrice, type: "止损" },
          { price: item.takeProfitPrice, type: "止盈" },
          { price: item.buyPrice, type: "买入" },
          { price: item.sellPrice, type: "卖出" },
        ];

        const closest = prices.reduce((prev, curr) => {
          const prevDiff = Math.abs(prev.price - item.price);
          const currDiff = Math.abs(curr.price - item.price);
          return currDiff < prevDiff ? curr : prev;
        });

        const targetPrice = closest.price;
        const targetPriceType = closest.type;

        return (
          <div key={item.id} className="flex items-center gap-2">
            <div>
              {item.name}[{item.symbol}]
            </div>
            <div>{item.price}</div>
            <div>
              目标价格: {targetPrice} ({targetPriceType})
            </div>
            {/* <div>{item.stopLossPrice}</div>
            <div>{item.takeProfitPrice}</div>
            <div>{item.buyPrice}</div>
            <div>{item.sellPrice}</div> */}
          </div>
        );
      })}
    </div>
  );
}

const strategy = [
  {
    id: 1,
    name: "策略1",
    symbol: "SZ000001",
    price: 1.231,
    stopLossPrice: 1.101,
    takeProfitPrice: 1.301,
    buyPrice: 1.201,
    sellPrice: 1.251,
  },
  {
    id: 2,
    name: "策略2",
    symbol: "SZ000002",
    price: 1.232,
    stopLossPrice: 1.202,
    takeProfitPrice: 1.252,
    buyPrice: 1.202,
    sellPrice: 1.252,
  },
  {
    id: 3,
    name: "策略3",
    symbol: "SZ000003",
    price: 1.233,
    stopLossPrice: 1.203,
    takeProfitPrice: 1.253,
    buyPrice: 1.203,
    sellPrice: 1.253,
  },
];

export default function Page() {
  return (
    <div className="flex flex-col h-full w-full">
      <header className="h-12 w-full border-b border-gray-300 flex items-center justify-between px-4">
        <Pencil />
      </header>
      <main className="flex flex-1 gap-4 p-4 flex-wrap">
        <SimpleCard title="最近操作" className="w-[420px] h-[300px]">
          <LastOperation data={lastOperation} />
        </SimpleCard>

        <SimpleCard title="自选" className="w-[420px] h-[300px]">
          <Favorite data={favorite} />
        </SimpleCard>

        <SimpleCard title="交易记录" className="w-[420px] h-[300px]">
          <LastOperation data={lastOperation} />
        </SimpleCard>

        <SimpleCard title="策略" className="w-[550px] h-[300px]">
          <Strategy data={strategy} />
        </SimpleCard>
      </main>
    </div>
  );
}
