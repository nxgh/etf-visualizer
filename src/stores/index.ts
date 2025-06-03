import * as strategyStore from "./modules/strategy";
import * as watchListStore from "./modules/watch-list";
import * as layoutStore from "./modules/layout";
import * as transactionStore from "./modules/transaction";

export * from "./modules/strategy";
export * from "./modules/watch-list";
export * from "./modules/layout";
export * from "./modules/transaction";

export const Store = {
  ...strategyStore,
  ...watchListStore,
  ...layoutStore,
  ...transactionStore,
};
