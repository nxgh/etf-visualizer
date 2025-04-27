interface IUpdateConfig {
  id: string | number;
  [key: string]: unknown;
}

export function update<T extends IUpdateConfig>(target: T, source: T[]): T[] {
  return source.map((item) => (item.id === target.id ? target : item));
}

export function remove<T extends IUpdateConfig>(target: T, source: T[]): T[] {
  return source.filter((item) => item.id !== target.id);
}

export function query<T extends IUpdateConfig>(source: T[], target: T): T | T[] | undefined {
  if (!target.id) {
    return source;
  }

  return source.find((item) => item.id === target.id);
}

export default {
  update,
  remove,
  query,
};
