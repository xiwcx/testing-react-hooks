import { useCallback, useMemo } from "react";
import { useHistory } from "react-router-dom";
import { parse, stringify } from "query-string";

export function useQueryParams() {
  const history = useHistory();

  const parsedQueryParams = useMemo(
    () => parse(history.location.search),
    [history.location.search]
  );

  const clearParams = useCallback(
    () => history.push({ pathname: history.location.pathname }),
    [history]
  );

  const setParam = useCallback(
    (key: string, value: unknown) =>
      history.push({
        search: stringify({ ...parsedQueryParams, [key]: value }),
      }),
    [parsedQueryParams, history]
  );

  return {
    clearParams,
    params: parsedQueryParams,
    setParam,
  };
}
