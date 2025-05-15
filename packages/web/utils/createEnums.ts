/**
 * 根据传入的对象生成枚举工具对象。
 * 每个 key 会生成一个包含 key、value、toString 方法的对象，便于类型安全和 IDE 智能提示。
 *
 * @template T - 枚举对象的类型，key 为枚举值，value 为显示文本
 * @param {T} data - 枚举对象，例如 {apple: '苹果', banana: '🍌' }
 * @returns {{ [K in keyof T]: { value: T[K]; key: K;  } }}
 * @example
 * const TabEnum = createEnums({apple: '苹果', banana: '🍌' } as const);
 *
 * TabEnum.apple.value // '苹果'
 * TabEnum.apple.key // 'apple'
 * TabEnum.banana.key // 'banana'
 * TabEnum.banana.value // '🍌'
 */
export function createEnums<T extends Record<string, string>>(data: T) {
  type EnumItem<K extends keyof T> = {
    readonly value: T[K];
    readonly key: K;
  };

  const result = {} as { [K in keyof T]: EnumItem<K> };

  for (const key of Object.keys(data) as Array<keyof T>) {
    const enumItem = {
      key: key,
      value: data[key],
    };
    Object.freeze(enumItem); // 防止属性被修改
    result[key] = enumItem;
  }

  return Object.freeze(result);
}

/**
 * @example
 * type kt = GetCreateEnumsKeyType<typeof TabEnum>; // "apple" | "banana"
 */
export type GetCreateEnumsKeyType<T> = keyof T;

/**
 * @example
 * type vt = GetCreateEnumsValueType<typeof TabEnum>; // "苹果" | "🍌"
 */
export type GetCreateEnumsValueType<T> = T extends { [K in keyof T]: { value: infer V } } ? V : never;

export default createEnums;
