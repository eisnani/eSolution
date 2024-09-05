import { useLocation } from "react-router-dom";

export function useQueryFn() {
  const queryString = useLocation().search;
  const queryParams = new URLSearchParams(queryString);
  const query = queryParams.get('q');

  return { query };
}