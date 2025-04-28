import { StoreName, createSelectors, useStore, type StoreState } from "./create-store";

// 通用 Store 类，用于管理特定 slice 的状态
export class BaseStore<T extends object> {
  // 添加泛型约束
  name: StoreName;

  constructor(name: StoreName, initialState: T[] = []) {
    this.name = name;
    // 初始化存储状态，仅当 Store 中尚无数据时
    const currentState = useStore.getState()[this.name];
    if ((!currentState || currentState.length === 0) && initialState.length > 0) {
      this.init(initialState);
    }
  }
  getStore() {
    return useStore;
  }

  // 获取当前 slice 的状态
  getState(): T[] {
    // 提供更安全的类型断言
    const store = createSelectors(useStore);
    const state = store.use[this.name]() as unknown as T[];
    console.log("state", state);
    return state;
  }

  // 初始化 slice 状态
  init(items: T[]): void {
    console.log(`初始化 ${this.name}`, items);
    useStore.setState({ [this.name]: items } as Partial<StoreState>);
  }

  // 插入新项
  insert(item: T): void {
    console.log(`添加 ${this.name} 项`, item);
    useStore.setState((state) => {
      const currentItems = (state[this.name] as unknown as T[] | undefined) ?? [];
      return { [this.name]: [...currentItems, item] } as Partial<StoreState>;
    });
  }

  // 更新项，需要提供 idField
  update(item: T, idField: keyof T): void {
    console.log(`更新 ${this.name} 项`, item);
    useStore.setState((state) => {
      const currentItems = (state[this.name] as unknown as T[] | undefined) ?? [];
      // 确保 item[idField] 存在
      if (item[idField] === undefined) {
        console.error(`更新失败：${this.name} 项缺少 idField '${String(idField)}'`, item);
        return {}; // 不做任何更改
      }
      const updatedItems = currentItems.map((i) => (i[idField] === item[idField] ? item : i));
      return { [this.name]: updatedItems } as Partial<StoreState>;
    });
  }

  // 删除项，需要提供 idField
  remove(item: T, idField: keyof T): void {
    console.log(`删除 ${this.name} 项`, item);
    useStore.setState((state) => {
      const currentItems = (state[this.name] as unknown as T[] | undefined) ?? [];
      // 确保 item[idField] 存在
      if (item[idField] === undefined) {
        console.error(`删除失败：${this.name} 项缺少 idField '${String(idField)}'`, item);
        return {}; // 不做任何更改
      }
      const filteredItems = currentItems.filter((i) => i[idField] !== item[idField]);
      return { [this.name]: filteredItems } as Partial<StoreState>;
    });
  }

  // 获取当前 slice 的所有项
  getItems(): T[] {
    // 直接调用 getState 获取最新状态
    return this.getState();
  }
}
