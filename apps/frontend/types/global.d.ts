import type {
  IBaseType,
  IStrategyConfig as LocalIStrategyConfig,
  ITradRecord as LocalITradRecord,
  IWatchList as LocalIWatchList,
} from "./model.d";

declare global {
  interface IStrategyConfig extends LocalIStrategyConfig {}

  interface ITradRecord extends LocalITradRecord {}

  interface IWatchList extends LocalIWatchList {}

  type BaseParams<T> = Partial<T> & Pick<IBaseType, "code">;
}

export default global;
