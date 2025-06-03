interface PlanProps {
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

const plan = [
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

export function Plan() {
  const data = plan;

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
