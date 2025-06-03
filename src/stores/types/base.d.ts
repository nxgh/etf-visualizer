export interface BaseType {
  id: string;
  create_at: string;
  update_at: string;
  code: string;
}

export type BaseParams<T> = Partial<T> & Pick<BaseType, "code">;
