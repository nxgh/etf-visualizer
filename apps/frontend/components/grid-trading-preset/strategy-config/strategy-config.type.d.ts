/**
 * @description 网格策略配置 (Grid strategy configuration)
 */
export default interface GridTradeStrategyConfig {
  /**
   * @description 网格策略ID
   */
  id: string | number;
  /**
   * @description 网格名称 (Grid strategy identifier/name)
   */
  gridName: string;

  /**
   * @description 交易品种 (Trading instrument pair)
   */
  tradingPair: string;

  /**
   * @description 基准价格 (Reference price for grid calculations)
   */
  basePrice: number;

  /**
   * @description 涨幅 (Price increase percentage threshold)
   */
  priceIncrease: number;

  /**
   * @description 跌幅 (Price decline percentage threshold)
   */
  priceDecline: number;

  /**
   * @description 压力测试 (Stress testing mode flag)
   */
  stressTest: number;

  /**
   * @description 逐格加码 (Progressive position scaling)
   */
  gridStepIncrement: number;

  /**
   * @description 利润留存 (Profit retention percentage)
   */
  profitRetention: number;
}
