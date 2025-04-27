import { pick } from "lodash-es";
import type { GridTradeStrategyConfigType } from "../strategy-config";
import type GridLevelRecordType from "./preset-data";
import Decimal from "decimal.js";

function create(): GridLevelRecordType {
  return {
    positionIndex: 0,
    level: 0,
    buyPrice: 0,
    buyQuantity: 0,
    buyAmount: 0,
    sellPrice: 0,
    sellQuantity: 0,
    sellAmount: 0,
    remainingQuantity: 0,
    retainedProfit: 0,
    profit: 0,
    yieldRate: 0,
  };
}

function generate(params: GridTradeStrategyConfigType): GridLevelRecordType[] {
  // 动态生成10档网格价格
  const result: GridLevelRecordType[] = [];
  const basePrice = new Decimal(params.basePrice);
  const priceIncrease = new Decimal(params.priceIncrease).div(100);
  const priceDecline = new Decimal(params.priceDecline).div(100);
  const profitRetention = new Decimal(params.profitRetention).div(100);
  const gridStepIncrement = new Decimal(params.gridStepIncrement).div(100);
  const baseQuantity = new Decimal(params?.buyVolume || 1000); // 基础买入数量，可以根据需求调整

  let currentPrice = basePrice;

  // 生成10档网格
  for (let i = 0; i < 10; i++) {
    // 计算买入价格
    const buyPrice = i === 0 ? currentPrice : currentPrice.times(new Decimal(1).minus(priceDecline));

    // 计算卖出价格
    const sellPrice = buyPrice.times(new Decimal(1).plus(priceIncrease));

    // 计算买入数量（考虑逐格加码）
    const buyQuantity = baseQuantity.times(new Decimal(1).plus(gridStepIncrement.times(i)));

    // 计算买入金额
    const buyAmount = buyPrice.times(buyQuantity);

    // 计算卖出数量（考虑留存一部分）
    const sellQuantity = buyQuantity.times(new Decimal(1).minus(profitRetention)).ceil();
    // 计算卖出金额
    const sellAmount = sellPrice.times(sellQuantity);

    // 计算留存数量
    const remainingQuantity = buyQuantity.minus(sellQuantity);

    // 计算利润
    const profit = sellAmount.minus(buyAmount.times(sellQuantity.div(buyQuantity)));

    // 计算留存利润
    const retainedProfit = sellPrice.minus(buyPrice).times(remainingQuantity);

    // 计算收益率
    const yieldRate = profit.div(buyAmount.times(sellQuantity.div(buyQuantity))).times(100);

    // 创建网格档位记录
    const record: GridLevelRecordType = {
      positionIndex: i + 1,
      level: Number(((10 - i) * 0.1).toFixed(1)),
      buyPrice: Number(buyPrice.toFixed(3)),
      buyQuantity: Number(buyQuantity.toFixed(2)),
      buyAmount: Number(buyAmount.toFixed(2)),
      sellPrice: Number(sellPrice.toFixed(3)),
      sellQuantity: Number(sellQuantity.toFixed(2)),
      sellAmount: Number(sellAmount.toFixed(2)),
      remainingQuantity: Number(remainingQuantity.toFixed(2)),
      retainedProfit: Number(retainedProfit.toFixed(2)),
      profit: Number(profit.toFixed(2)),
      yieldRate: Number(yieldRate.toFixed(2)),
    };

    result.push(record);

    // 更新当前价格为买入价格，为下一档做准备
    currentPrice = buyPrice;
  }

  return result;
}

export default {
  create,
  generate,
};
