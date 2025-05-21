import Decimal from "decimal.js";
import type { BaseParams, StrategyConfig, TransactionRecord } from "../types/type.d";

/**
 * 添加时间戳
 */
export const withTimestamp = <T extends object>(data: T) => ({
  ...data,
  create_at: Date.now().toString(),
  update_at: Date.now().toString(),
});

/**
 * 创建网格策略
 */
export function createStrategy(params: BaseParams<StrategyConfig>): StrategyConfig {
  const defaultConfig: StrategyConfig = withTimestamp({
    id: Date.now().toString(),
    strategyName: "",
    code: "",
    basePrice: 1,
    buyVolume: 1000,
    priceIncrease: 5,
    priceDecline: 5,
    stressTest: 100,
    gridStepIncrement: 0,
    profitRetention: 5,
    securityName: "",
    source: "",
    name: "",
  });

  return {
    ...defaultConfig,
    ...params,
  };
}

/**
 * 生成网格交易记录
 */
export function generateGrid(params: StrategyConfig): ITradRecord[] {
  const result: ITradRecord[] = [];
  const basePrice = new Decimal(params.basePrice);
  const priceIncrease = new Decimal(params.priceIncrease).div(100);
  const priceDecline = new Decimal(params.priceDecline).div(100);
  const profitRetention = new Decimal(params.profitRetention).div(100);
  const gridStepIncrement = new Decimal(params.gridStepIncrement).div(100);
  const baseQuantity = new Decimal(params?.buyVolume || 1000);

  const count = params.stressTest / 10;
  let currentPrice = basePrice;

  for (let i = 0; i < count; i++) {
    const buyPrice = i === 0 ? currentPrice : currentPrice.times(new Decimal(1).minus(priceDecline));
    const sellPrice = buyPrice.times(new Decimal(1).plus(priceIncrease));
    const buyQuantity = baseQuantity.times(new Decimal(1).plus(gridStepIncrement.times(i)));
    const buyAmount = buyPrice.times(buyQuantity);
    const sellQuantity = buyQuantity.times(new Decimal(1).minus(profitRetention)).ceil();
    const sellAmount = sellPrice.times(sellQuantity);
    const remainingQuantity = buyQuantity.minus(sellQuantity);
    const profit = sellAmount.minus(buyAmount.times(sellQuantity.div(buyQuantity)));
    const retainedProfit = sellPrice.minus(buyPrice).times(remainingQuantity);
    const yieldRate = profit.div(buyAmount.times(sellQuantity.div(buyQuantity))).times(100);

    const record: ITradRecord = createRecord({
      positionIndex: i + 1,
      code: params.code,
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
    });

    result.push(record);
    currentPrice = buyPrice;
  }

  return result;
}

/**
 * 计算金额
 */
export function calculateAmount(price: number, quantity: number): number {
  return new Decimal(price).times(new Decimal(quantity)).toNumber();
}
