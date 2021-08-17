import { renderHook } from "@testing-library/react-hooks";
import { useQueryParams } from "./use-query-params";
import { createMemoryHistory, MemoryHistory } from "history";
import { Router } from "react-router-dom";

const renderUseQueryParamsHook = (history: MemoryHistory) =>
  renderHook(() => useQueryParams(), {
    wrapper: ({ children }) => <Router history={history}>{children}</Router>,
  });

describe("useQueryParams hook", () => {
  test("setParam works as expected", () => {
    const history = createMemoryHistory();
    const pushSpy = jest.spyOn(history, "push");
    const { result } = renderUseQueryParamsHook(history);

    result.current.setParam("foo", "bar");

    expect(pushSpy).toHaveBeenCalledTimes(1);
    expect(pushSpy).toHaveBeenCalledWith({ search: "foo=bar" });
    expect(history.location.search).toEqual("?foo=bar");
  });

  test.each([
    ["no params", "/"],
    ["no params", "/?foo=bar"],
  ])("params are retrieved correctly: %s", (_, initialPath) => {
    const history = createMemoryHistory();
    history.push(initialPath);
    const { result } = renderUseQueryParamsHook(history);

    expect(result.current.params).toMatchSnapshot();
  });

  test.each([
    ["root", "/", "/"],
    ["root", "/?foo=bar", "/"],
    ["root", "/test/?foo=bar", "/test/"],
  ])(
    "clearParams works as expected: %s",
    (_, initialPath, expectedPathname) => {
      const history = createMemoryHistory();
      history.push(initialPath);
      const pushSpy = jest.spyOn(history, "push");
      const { result } = renderUseQueryParamsHook(history);

      result.current.clearParams();

      expect(pushSpy).toHaveBeenCalledTimes(1);
      expect(pushSpy).toHaveBeenCalledWith({ pathname: expectedPathname });
      expect(history.location.pathname).toEqual(expectedPathname);
      expect(history.location.search).toEqual("");
    }
  );

  test.each([
    ["root", "/", "foo", "bar", "?foo=bar"],
    ["root", "/?foo=bar", "foo", "bar", "?foo=bar"],
    ["root", "/?foo=bar", "bar", "foo", "?bar=foo&foo=bar"],
  ])(
    "clearParams works as expected: %s",
    (_, initialPath, key, value, expectedPathname) => {
      const history = createMemoryHistory();
      history.push(initialPath);
      const { result } = renderUseQueryParamsHook(history);

      result.current.setParam(key, value);

      expect(history.location.search).toEqual(expectedPathname);
    }
  );
});
