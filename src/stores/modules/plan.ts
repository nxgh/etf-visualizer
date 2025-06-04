import { createPersistStore } from "../core";

interface PlanConfig {
  id: string;
  name: string;
  desc: string;
  type: string;
  // 交易品种
  products: { symbol: string; name: string }[];
}

interface PlanStore {
  planList: PlanConfig[];
  insert: (params: PlanConfig) => void;
  update: (params: PlanConfig) => void;
}

const defaultPlanConfig: PlanConfig = {
  id: "",
  name: "",
  desc: "",
  type: "",
  products: [],
};

const planStore = createPersistStore<PlanStore>(
  "plan",
  {
    planList: [],
  },
  (set) => ({
    planList: [],
    insert: (params: PlanConfig) => {
      set((state) => ({ planList: [...state.planList, params] }));
    },
    update: (params: PlanConfig) => {
      set((state) => ({
        ...state,
        planList: state.planList.map((item) => (item.id === params.id ? params : item)),
      }));
    },
  })
);

export { planStore };
