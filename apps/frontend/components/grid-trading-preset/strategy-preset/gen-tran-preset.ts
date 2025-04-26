import Decimal from "decimal.js";

export interface TransactionPresetType {
  // 档位
  level: number;
  // 买入价
  buyTriggerPrice: number;
  // 卖出价
  sellTriggerPrice: number;
  // 数量
  buyVolume?: number | string;
  sellVolume?: number | string;
  // 收益
  profit: number;
  // 收益率
  profitRate: number;
}

export const generateTransactionPreset = (
  basePrice: number,
  // 股数

  rise: number,
  fall: number
): TransactionPresetType[] => {
  let currentPrice = new Decimal(basePrice);
  const result: TransactionPresetType[] = [];

  rise = rise / 100;
  fall = fall / 100;

  // 动态生成10档网格价格
  for (let i = 0; i < 10; i++) {
    const buyPrice = i === 0 ? currentPrice : currentPrice.times(new Decimal(1).minus(fall));
    const sellPrice = buyPrice.times(new Decimal(1).plus(rise));

    // 计算收益和收益率
    const profit = sellPrice.minus(buyPrice);
    const profitRate = profit.div(buyPrice);

    const item: TransactionPresetType = {
      level: new Decimal(10).minus(i).times(0.1).toNumber(),
      buyTriggerPrice: Number(buyPrice.toFixed(3)), // 保留四位小数
      sellTriggerPrice: Number(sellPrice.toFixed(3)),
      profit: Number(profit.toFixed(3)),
      profitRate: Number(profitRate.times(100).toFixed(2)), // 以百分比形式表示
      buyVolume: 0,
      sellVolume: 0,
    };

    result.push(item);

    // 交替更新基准价为最新触发价
    currentPrice = i % 2 === 0 ? buyPrice : sellPrice;
  }

  return result;
};

export default generateTransactionPreset;
