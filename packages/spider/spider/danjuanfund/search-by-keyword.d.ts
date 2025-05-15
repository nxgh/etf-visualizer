interface ExtMap {
  fundStatus: string;
  tyCategory: string;
}

interface ItemsItem {
  id: number;
  scode: string;
  sname: string;
  stype: string;
  yield: string;
  rela_code: string;
  store_status: number;
  ext_map: ExtMap;
}

interface Data {
  items: ItemsItem[];
  current_page: number;
  size: number;
  total_items: number;
  total_pages: number;
}

export interface SearchByKeywordJSON {
  data: Data;
  result_code: number;
}
