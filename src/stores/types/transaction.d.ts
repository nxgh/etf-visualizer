import type { BaseType } from "./base";

export interface TransactionRecord extends BaseType {
  /** @description 来源 */
  source?: string;
  /** @description 层级/Price interval level */
  level: number;
  /** @description 价格/Triggered purchase price */
  price: number;
  /** @description 时间/Time */
  date: string;
  /** @description 数量/Purchased quantity */
  quantity: number;
}
