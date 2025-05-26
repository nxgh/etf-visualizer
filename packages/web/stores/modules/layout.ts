import { createPersistStore, createSelectors } from "../core";

export type LayoutConfig = Record<string, ReactGridLayout.Layout[]>;

interface LayoutStore {
  layout: LayoutConfig;
  insert: (params: LayoutConfig) => void;
  update: (params: LayoutConfig) => void;
}

const layoutStore = createPersistStore<LayoutStore>(
  "layout",
  {
    layout: {},
  },
  (set) => ({
    layout: {},
    insert: (params: LayoutConfig) => {
      set((state) => ({ layout: { ...state.layout, ...params } }));
    },
    update: (params: LayoutConfig) => {
      set((state) => ({
        layout: { ...state.layout, ...params },
      }));
    },
  })
);

const layoutStoreAction = createSelectors(layoutStore);

export { layoutStore, layoutStoreAction };
