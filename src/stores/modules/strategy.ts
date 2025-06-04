import { createPersistStore } from "../core";

import type { StrategyConfig } from "../types/type.d";

interface StrategyStore {
  presetList: StrategyConfig[];
  insert: (params: StrategyConfig) => void;
  update: (params: StrategyConfig) => void;
}

const defaultStrategyConfig: StrategyConfig = {
  id: "",
  strategyName: "网格交易",
  basePrice: 0,
  buyVolume: 0,
  priceIncrease: 0,
  priceDecline: 0,
  stressTest: 0,
  gridStepIncrement: 0,
  profitRetention: 0,
  source: "",
};

const strategyStore = createPersistStore<StrategyStore>(
  "strategy",
  {
    presetList: [],
  },
  (set) => ({
    presetList: [],
    insert: (params: StrategyConfig) => {
      set((state) => ({ presetList: [...state.presetList, params] }));
    },
    update: (params: StrategyConfig) => {
      set((state) => ({
        ...state,
        presetList: state.presetList.map((item) => (item.id === params.id ? params : item)),
      }));
    },
  })
);

export { strategyStore };
