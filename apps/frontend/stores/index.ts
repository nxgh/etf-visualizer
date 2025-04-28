import { BaseStore } from "./base-store";
import type { IGridTradeStrategyConfig, IGridLevelRecord, IWatchListItem } from "./model.type";
import { STORE_KEYS } from "./create-store";

export function createStrategy(): IGridTradeStrategyConfig {
  return {
    id: Date.now(),
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

// PresetList 模型，管理 IGridTradeStrategyConfig 类型的项
// IGridTradeStrategyConfig 必须包含 'id' 字段
export class PresetListModel extends BaseStore<IGridTradeStrategyConfig> {
  constructor(initialState: IGridTradeStrategyConfig[] = []) {
    super(STORE_KEYS.PRESET_LIST, initialState);
  }

  /**
   * 创建网格策略
   * @returns 网格策略
   */

  insertEmpty(): void {
    this.insert(createStrategy());
  }

  // 可以添加特定于 PresetList 的方法
  updatePreset(item: IGridTradeStrategyConfig) {
    this.update(item, "id"); // 默认使用 'id' 作为 idField
  }
  removePreset(item: IGridTradeStrategyConfig) {
    this.remove(item, "id"); // 默认使用 'id' 作为 idField
  }
}

// Transaction 模型，管理 IGridLevelRecord 类型的项
// IGridLevelRecord 必须包含 'id' 字段
export class TransactionModel extends BaseStore<IGridLevelRecord> {
  // 修正泛型类型
  constructor(initialState: IGridLevelRecord[] = []) {
    super(STORE_KEYS.TRANSACTION, initialState);
  }

  /**
   * 创建网格档位记录
   * @returns 网格档位记录
   */
  createRecord(params: Partial<IGridLevelRecord>): IGridLevelRecord {
    return {
      id: Date.now(),
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

  insertEmpty(): void {
    console.log("insertEmpty", this.getState());
    const lastItem = this.getState();
    this.insert(
      this.createRecord({
        positionIndex: lastItem.length + 1,
        level: 1,
      })
    );
  }

  // 可以添加特定于 Transaction 的方法
  updateTransaction(item: IGridLevelRecord) {
    this.update(item, "id"); // 默认使用 'id' 作为 idField
  }
  removeTransaction(item: IGridLevelRecord) {
    this.remove(item, "id"); // 默认使用 'id' 作为 idField
  }
}

// WatchList 模型，管理 IWatchListItem 类型的项
// IWatchListItem 使用 'code' 作为唯一标识符
export class WatchListModel extends BaseStore<IWatchListItem> {
  constructor(initialState: IWatchListItem[] = []) {
    super(STORE_KEYS.WATCH_LIST, initialState);
  }
  // 可以添加特定于 WatchList 的方法
  updateWatchItem(item: IWatchListItem) {
    this.update(item, "code"); // 使用 'code' 作为 idField
  }
  removeWatchItem(item: IWatchListItem) {
    this.remove(item, "code"); // 使用 'code' 作为 idField
  }
  // 如果需要按 code 删除
  removeFromWatchListByCode(code: string) {
    this.remove({ code } as IWatchListItem, "code"); // 构造一个临时对象来删除
  }
}

class PresetListTemplateModel extends BaseStore<IGridTradeStrategyConfig> {
  constructor(initialState: IGridTradeStrategyConfig[] = []) {
    super(STORE_KEYS.PRESET_LIST_TEMPLATE, initialState);
  }
}

// 创建并导出 Store 实例，方便直接使用
export const presetListStore = new PresetListModel();
export const transactionStore = new TransactionModel();
export const watchListStore = new WatchListModel();
export const presetListTemplateStore = new PresetListTemplateModel();

export default {
  presetListStore,
  transactionStore,
  watchListStore,
  presetListTemplateStore,
};
export type { IGridTradeStrategyConfig, IGridLevelRecord, IWatchListItem };

export { generateGrid } from "./helper";
