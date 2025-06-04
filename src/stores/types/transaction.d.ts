export interface TransactionRecord {
  id: string;
  code: string;
  name?: string;
  /** @description 来源 */
  source?: string;
  /** @description 价格/Triggered purchase price */
  price: number;
  /** @description 时间/Time */
  date: string;
  /** @description 数量/Purchased quantity */
  quantity: number;
  /** @description 分类/Category */
  category: string;
  /** @description 备注/Remark */
  remark: string;
  /** @description 费用/Fee */
  fee: number;
  /** @description 利润/Profit */
  profit?: number;
  /** @description 利润率/Profit rate */
  profitRate?: number;

  /** @description 档位/Level */
  level?: string;

  create_at: string;
  update_at: string;
}
