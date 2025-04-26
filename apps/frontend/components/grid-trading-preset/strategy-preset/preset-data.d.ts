/**
 *  @description 网格交易档位详细信息/Grid trading level detailed information
 */
export default interface GridLevelRecordType {
  /**
   *  @description 交易顺序编号/Transaction sequence number
   */
  positionIndex: number;

  /**
   *  @description 价格区间层级/Price interval level
   */
  level: number;

  /**
   *  @description 触发买入价格/Triggered purchase price
   */
  buyPrice: number;

  /**
   *  @description 买入数量/Purchased quantity
   */
  buyQuantity: number;

  /**
   *  @description 买入总金额/Total purchase amount
   */
  buyAmount: number;

  /**
   *  @description 触发卖出价格/Triggered sell price
   */
  sellPrice: number;

  /**
   *  @description 卖出数量/Sold quantity
   */
  sellQuantity: number;

  /**
   *  @description 卖出总金额/Total sell amount
   */
  sellAmount: number;

  /**
   *  @description 未卖出持仓数量/Unsold position quantity
   */
  remainingQuantity: number;

  /**
   *  @description 本档保留利润/Profit retained in this level
   */
  retainedProfit: number;

  /**
   *  @description 已实现收益/Realized profit
   */
  profit: number;

  /**
   *  @description 收益率/Return rate percentage
   */
  yieldRate: number;
}
