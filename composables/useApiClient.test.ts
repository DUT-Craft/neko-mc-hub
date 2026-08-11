import { describe, expect, it } from "vitest";
import { getApiErrorMessage } from "./useApiClient";

describe("getApiErrorMessage", () => {
  it("prefers the backend business message", () => {
    expect(
      getApiErrorMessage({
        data: { message: "账号或密码错误" },
        message: '[POST] "http://127.0.0.1:8080/api/auth/login": 401'
      })
    ).toBe("账号或密码错误");
  });

  it.each([
    '[GET] "http://127.0.0.1:8080/api/public/home": <no response> fetch failed',
    "Failed to fetch",
    "The operation was aborted due to timeout"
  ])("replaces technical transport errors with the caller fallback", (message) => {
    expect(getApiErrorMessage({ message }, "暂时无法连接服务器")).toBe("暂时无法连接服务器");
  });

  it("keeps a readable application error", () => {
    expect(getApiErrorMessage(new Error("当前内容无法保存"))).toBe("当前内容无法保存");
  });
});
