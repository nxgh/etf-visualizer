import type GridTradeStrategyConfigType from "./strategy-config.type";

export default class StrategyConfig {
  public static create(): GridTradeStrategyConfigType {
    return {
      id: Date.now(),
      gridName: "",
      tradingPair: "",
      basePrice: 1,
      buyVolume: 1000,
      priceIncrease: 5, // 5% increase
      priceDecline: 5, // 5% decline
      stressTest: 0,
      gridStepIncrement: 0,
      profitRetention: 5, // 50% profit retention
    };
  }
}

export type { GridTradeStrategyConfigType };
