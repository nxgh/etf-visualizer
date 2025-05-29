import { useShallow } from "zustand/shallow";
import { createPersistStore, createSelectors } from "../core";

interface ConfigStore {
  config: Record<string, unknown>;

  createTableName: (name: string) => void;
}

const configStore = createPersistStore<ConfigStore>(
  "config",
  {
    config: {},
  },
  (set, get) => ({
    config: {},
    createTableName: (name: string) => {
      set((state) => ({
        config: {
          ...state.config,
          [name]: [],
        },
      }));
    },
  })
);

const configStoreAction = createSelectors(configStore);

export { configStore, configStoreAction };
