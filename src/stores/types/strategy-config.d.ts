import type { BaseType } from "./base";

export interface StrategyConfig extends BaseType {
  /** @description 策略名称 */
  strategyName: string;

  /** @description 基准价格 (Reference price for grid calculations) */
  basePrice: number;

  /** @description 买入数量 (Buy quantity) */
  buyVolume: number;

  /** @description 涨幅 (Price increase percentage threshold) */
  priceIncrease: number;

  /** @description 跌幅 (Price decline percentage threshold) */
  priceDecline: number;

  /** @description 压力测试 (Stress testing mode flag) */
  stressTest: number;

  /** @description 逐格加码 (Progressive position scaling) */
  gridStepIncrement: number;

  /** @description 利润留存 (Profit retention percentage) */
  profitRetention: number;

  /** @description 来源 */
  source: string;
}
g;
