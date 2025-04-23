import { create } from "zustand";

// TODO: Type
type SearchServiceResponse = { code: string; name: string };

type SearchData = {
  stock: SearchServiceResponse[];
  fund: SearchServiceResponse[];
};

export const useSecurityStore = create<{
  favoriteList: SearchServiceResponse[];
  searchData: SearchData;
  setSearchData: (data?: SearchData) => void;
  initFavoriteList: (data: SearchServiceResponse[]) => void;
  addFavoriteList: (data: SearchServiceResponse) => void;
  removeFavoriteList: (code: string) => void;
}>((set) => ({
  favoriteList: [],
  searchData: {
    stock: [],
    fund: [],
  },
  setSearchData: (data?: SearchData) => set({ searchData: data || { stock: [], fund: [] } }),
  initFavoriteList: (data: SearchServiceResponse[]) => set({ favoriteList: data }),
  addFavoriteList: (data: SearchServiceResponse) => set((state) => ({ favoriteList: [...state.favoriteList, data] })),
  removeFavoriteList: (code: string) => set((state) => ({ favoriteList: state.favoriteList.filter((item) => item.code !== code) })),
}));
