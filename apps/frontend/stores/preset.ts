import storage from "./idb-storage";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import dayjs from "dayjs";
import type GridTradeStrategyConfig from "#components/grid-trading-preset/strategy-config/strategy-config.type";

interface GridTradeStrategy {
  presetList: GridTradeStrategyConfig[];
  init: (presetList: GridTradeStrategyConfig[]) => void;
  insert: (preset: GridTradeStrategyConfig) => void;
  update: (preset: GridTradeStrategyConfig) => void;
  remove: (preset: GridTradeStrategyConfig) => void;
}

export const useGridTradeStrategyStore = create<GridTradeStrategy>()(
  persist(
    (set, get) => ({
      presetList: [],
      init: (presetList: GridTradeStrategyConfig[]) => {
        console.log("init presetList", presetList);
        set({ presetList });
      },
      insert: (preset: GridTradeStrategyConfig) => {
        const newPresetList = [...get().presetList, preset];
        console.log("insert presetList", newPresetList);
        set({ presetList: newPresetList });
      },
      update: (preset: GridTradeStrategyConfig) => {
        const newList = get().presetList.map((p) => (p.id === preset.id ? preset : p));
        console.log("update presetList", newList);
        set({ presetList: newList });
      },
      remove: (preset: GridTradeStrategyConfig) => {
        const presetList = get().presetList.filter((p) => p.id !== preset.id);
        console.log("remove presetList", presetList);
        set({ presetList });
      },
    }),
    {
      name: "preset-list-storage",
      storage: createJSONStorage(() => storage),
    }
  )
);

export default useGridTradeStrategyStore;
