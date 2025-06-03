import { cn } from "@shadcn/lib/utils";

const lastOperation = [
  { id: 1, date: "2025-05-30", name: "证券AAAA", price: 100, amount: 100, code: "000001" },
  { id: 2, date: "2025-05-30", name: "证券BBBB", price: 100, amount: -120, code: "000001" },
  { id: 3, date: "2025-05-30", name: "证券AAAAA", price: 100, amount: -120, code: "000001" },
  { id: 4, date: "2025-05-30", name: "证券CCCC", price: 100, amount: -120, code: "000001" },
  { id: 5, date: "2025-05-30", name: "证券DDDD", price: 100, amount: 100, code: "000001" },
  { id: 6, date: "2025-05-30", name: "证券FFFF", price: 100, amount: 100, code: "000001" },
];
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
export function LastOperation() {
  const data = lastOperation;

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
