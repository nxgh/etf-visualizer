import { create, type StateCreator } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { createJSONStorage } from "zustand/middleware";
import { storage } from "./persist-storage";

export const createPersistStore = <T extends object>(
  name: string,
  initialState: Partial<T>,
  stateUpdaters: StateCreator<T, [["zustand/devtools", never], ["zustand/persist", unknown]], [], T>
) =>
  create<T>()(
    devtools(
      persist(stateUpdaters, {
        name,
        storage: createJSONStorage(() => storage),
      }),
      {
        name,
        enabled: process.env.NODE_ENV === "development",
      }
    )
  );
