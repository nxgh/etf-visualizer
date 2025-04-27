/**
 * @description 网格策略配置 (Grid strategy configuration)
 */
export interface IGridTradeStrategyConfig {
  /** @description 网格策略ID */
  id: string | number;

  /** @description 网格名称 (Grid strategy identifier/name) */
  gridName: string;

  /** @description 交易品种 (Trading instrument pair) */
  tradingPair: string;

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
}

/**
 *  @description 网格交易档位详细信息/Grid trading level detailed information
 */
export interface IGridLevelRecord {
  /** @description 交易ID/Transaction ID */
  id: string | number;

  /** @description 交易策略ID/Transaction strategy ID */
  strategyId?: string | number;

  /** @description 交易品种/Trading instrument pair */
  tradingPair?: string;

  /** @description 交易顺序编号/Transaction sequence number */
  positionIndex: number;

  /** @description 价格区间层级/Price interval level */
  level: number;

  /** @description 买入价格/Triggered purchase price */
  buyPrice: number;

  /** @description 买入时间/Purchase time */
  buyDate?: string;

  /** @description 买入数量/Purchased quantity */
  buyQuantity: number;

  /** @description 买入总金额/Total purchase amount */
  buyAmount: number;

  /** @description 卖出价格/Triggered sell price */
  sellPrice?: number;

  /** @description 卖出时间/Sell time */
  sellDate?: string;

  /** @description 卖出数量/Sold quantity */
  sellQuantity?: number;

  /** @description 卖出总金额/Total sell amount */
  sellAmount?: number;

  /** @description 未卖出持仓数量/Unsold position quantity */
  remainingQuantity?: number;

  /** @description 本档保留利润/Profit retained in this level */
  retainedProfit?: number;

  /** @description 已实现收益/Realized profit */
  profit: number;

  /** @description 收益率/Return rate percentage */
  yieldRate?: number;
}
