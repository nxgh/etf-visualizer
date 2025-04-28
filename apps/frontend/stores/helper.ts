import Decimal from "decimal.js";
import type { IGridLevelRecord, IGridTradeStrategyConfig } from "./model.type";

/**
 * 创建网格策略
 * @returns 网格策略
 */
export function createStrategy(): IGridTradeStrategyConfig {
  return {
    id: Date.now().toString(),
    gridName: "",
    tradingPair: "",
    basePrice: 1,
    buyVolume: 1000,
    priceIncrease: 5,
    priceDecline: 5,
    stressTest: 100,
    gridStepIncrement: 0,
    profitRetention: 5,
  };
}

/**
 * 创建网格档位记录
 * @returns 网格档位记录
 */
export function createRecord(params: Partial<IGridLevelRecord>): IGridLevelRecord {
  return {
    id: Date.now().toString(),
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
    ...params,
  };
}

/**
 * 生成网格档位记录
 * @param params 网格策略配置
 * @returns 网格档位记录
 */
export function generateGrid(params: IGridTradeStrategyConfig): IGridLevelRecord[] {
  const result: IGridLevelRecord[] = [];
  const basePrice = new Decimal(params.basePrice);
  const priceIncrease = new Decimal(params.priceIncrease).div(100);
  const priceDecline = new Decimal(params.priceDecline).div(100);
  const profitRetention = new Decimal(params.profitRetention).div(100);
  const gridStepIncrement = new Decimal(params.gridStepIncrement).div(100);
  const baseQuantity = new Decimal(params?.buyVolume || 1000); // 基础买入数量，可以根据需求调整

  const count = params.stressTest / 10;

  let currentPrice = basePrice;

  // 生成10档网格
  for (let i = 0; i < count; i++) {
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
    const record: IGridLevelRecord = {
      id: Date.now() + i,
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

/**
 * 计算金额
 * @param price 价格
 * @param quantity 数量
 * @returns 金额
 */
export function calculateAmount(price: number, quantity: number): number {
  return new Decimal(price).times(new Decimal(quantity)).toNumber();
}

export type { IGridTradeStrategyConfig, IGridLevelRecord };
