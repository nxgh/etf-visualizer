interface SearchResult {
  fundList: any[];
  stockList: any[];
}

const url = "http://127.0.0.1:3000";

export const searchSecurity = async (query: string): Promise<SearchResult> => {
  const res = await fetch(`${url}/api/search?keyword=${query}`, { method: "GET" });
  const json = await res.json();
  return json.data as SearchResult;
};

export const addFavorite = async (item: { code: string; name: string }) => {
  const res = await fetch("/api/favorite", {
    method: "POST",
    body: JSON.stringify(item),
  });
  return res.json();
};

export const deleteFavorite = async (code: string) => {
  const res = await fetch(`/api/favorite?code=${code}`, {
    method: "DELETE",
  });
  return res.json();
};

export const getFavorite = async () => {
  const res = await fetch("/api/favorite", {
    method: "GET",
  });
  return res.json();
};

export const getKline = async (code: string) => {
  const res = await fetch(`/api/kline?code=${code}`, {
    method: "GET",
  });
  return res.json();
};

export const getNets = async (code: string) => {
  const res = await fetch(`/api/fund?code=${code}`, {
    method: "GET",
  });
  return res.json();
};
