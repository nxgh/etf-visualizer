import { useShallow } from "zustand/shallow";
import { createPersistStore, createSelectors } from "../core";

interface LayoutStore {
  layouts: ReactGridLayout.Layout[];
  insert: (params: ReactGridLayout.Layout | ReactGridLayout.Layout[]) => void;
  update: (params: ReactGridLayout.Layout | ReactGridLayout.Layout[]) => void;
  init: (params: ReactGridLayout.Layout | ReactGridLayout.Layout[]) => void;

  changeStatic: (ids: string | string[], isStatic?: boolean) => void;
}

const layoutStore = createPersistStore<LayoutStore>(
  "layout",
  {
    layouts: [],
  },
  (set, get) => ({
    layouts: [],
    init: (params: ReactGridLayout.Layout | ReactGridLayout.Layout[]) => {
      if (get().layouts.length === 0) {
        set((state) => ({ layouts: Array.isArray(params) ? params : [params] }), undefined, "layout/init");
      } else {
        set((state) => {
          const newLayouts = state.layouts.map((layout) => ({ ...layout, static: true }));
          return { layouts: newLayouts } as Partial<LayoutStore>;
        });
      }
    },
    insert: (params: ReactGridLayout.Layout | ReactGridLayout.Layout[]) => {
      set((state) => ({ layouts: [...state.layouts, ...(Array.isArray(params) ? params : [params])] }), undefined, "layout/insert");
    },
    update: (params: ReactGridLayout.Layout | ReactGridLayout.Layout[]) => {
      const paramsArray = Array.isArray(params) ? params : [params];
      set(
        (state) => ({ layouts: state.layouts.map((layout) => paramsArray.find((p) => p.i === layout.i) || layout) }),
        undefined,
        "layout/update"
      );
    },
    changeStatic: (ids: string | string[], isStatic?: boolean) => {
      const idsArray = Array.isArray(ids) ? ids : [ids];
      set(
        (state) => {
          const newLayouts = state.layouts.map((layout) =>
            idsArray.includes(layout.i) ? { ...layout, static: isStatic !== undefined ? isStatic : !layout.static } : layout
          );
          return { layouts: newLayouts } as Partial<LayoutStore>;
        },
        undefined,
        "layout/changeMoved"
      );
    },
  })
);

export const useLayoutFilterByIds = (ids: string[]) => {
  const layout = layoutStore(useShallow((state: LayoutStore) => state.layouts.filter((layout) => layout && ids.includes(layout.i))));

  return layout;
};

const layoutStoreAction = createSelectors(layoutStore);

export { layoutStore, layoutStoreAction };
