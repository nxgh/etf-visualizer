import type { StockQuoteData } from "./stock-quote-json.js";

export interface BatchQuoteParams {
  symbol: string;
}

export interface BatchQuoteResponse {
  data: {
    items: StockQuoteData[];
    items_size: number;
  };
  error_code: number;
  error_description: string;
}
