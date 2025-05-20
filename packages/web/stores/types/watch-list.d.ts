import type { BaseType } from "./base";

export interface WatchList extends Omit<BaseType, "securityName"> {
  type: string;
  name: string;
}
