import Decimal from "decimal.js";

type level = number;
type buyTriggerPrice = number;
type sellTriggerPrice = number;
type profit = number;
type profitRate = number;

export const generateTransactionPreset = (
  basePrice: number,
  // 股数

  rise: number, // 百分比形式（如0.05表示5%）
  fall: number
): [level, buyTriggerPrice, sellTriggerPrice, profit, profitRate][] => {
  let currentPrice = new Decimal(basePrice);
  const result: [level, buyTriggerPrice, sellTriggerPrice, profit, profitRate][] = [];

  // 动态生成10档网格价格
  for (let i = 0; i < 10; i++) {
    const buyPrice = i === 0 ? currentPrice : currentPrice.times(new Decimal(1).minus(fall));
    const sellPrice = buyPrice.times(new Decimal(1).plus(rise));

    // 计算收益和收益率
    const profit = sellPrice.minus(buyPrice);
    const profitRate = profit.div(buyPrice);

    const item = {
      level: new Decimal(10).minus(i).times(0.1).toNumber(),
      buyTriggerPrice: Number(buyPrice.toFixed(3)), // 保留四位小数
      sellTriggerPrice: Number(sellPrice.toFixed(3)),
      profit: Number(profit.toFixed(3)),
      profitRate: Number(profitRate.times(100).toFixed(2)), // 以百分比形式表示
    };

    result.push([item.level, item.buyTriggerPrice, item.sellTriggerPrice, item.profit, item.profitRate]);

    // 交替更新基准价为最新触发价
    currentPrice = i % 2 === 0 ? buyPrice : sellPrice;
  }

  return result;
};

export default generateTransactionPreset;

const a = generateTransactionPreset(0.774, 0.085, 0.09);
console.log(a);
