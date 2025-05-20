import { watchListStore, watchListStoreAction, insertWatchList, removeWatchList } from "#stores/index";

export const useWatchListStoreAction = () => {};

const useWatchList = () => {
  const watchList = watchListStoreAction.use.watchList();
  console.log("watchList", watchList);
  return watchList;
};

export const useInsertWatchList = () => {
  const useInsert = watchListStoreAction.use.insert();
  return useInsert;
};

export { useWatchList, removeWatchList, insertWatchList };
