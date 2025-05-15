interface DataItem {
  code: string;
  label: string;
  query: string;
  state: number;
  stock_type: number;
  type: number;
}

interface Meta {
  count: number;
  feedback: number;
  has_next_page: boolean;
  maxPage: number;
  page: number;
  query_id: number;
  size: number;
}

export interface SuggestStockJSON {
  code: number;
  data: DataItem[];
  message: string;
  meta: Meta;
  success: boolean;
}
