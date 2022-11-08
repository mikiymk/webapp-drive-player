/* eslint-disable camelcase */
import { describe, expect, test, vi } from "vitest";

import { requestAccessToken } from "../auth";

describe("Google APIを使用したアクセストークンをダウンロードする関数", () => {
  test("リクエストが正しい引数で行われる", async () => {
    window.fetch = vi.fn(() =>
      Promise.resolve({
        json() {
          return Promise.resolve({
            access_token: "access token",
          });
        },
      } as Response),
    );

    const response = await requestAccessToken("redirect uri", "code");

    expect(response).toBeDefined();
    expect(window.fetch).toBeCalledTimes(1);
    expect(window.fetch).toBeCalledWith(
      "/api/token?redirect_uri=redirect+uri&code=code",
    );
  });

  test("リクエストが正しい引数で行われる: コードなし", async () => {
    window.fetch = vi.fn(() =>
      Promise.resolve({
        json() {
          return Promise.resolve({
            access_token: "access token",
          });
        },
      } as Response),
    );

    const response = await requestAccessToken("redirect uri");

    expect(response).toBeDefined();
    expect(window.fetch).toBeCalledTimes(1);
    expect(window.fetch).toBeCalledWith("/api/token?redirect_uri=redirect+uri");
  });

  test("レスポンスを返す", async () => {
    window.fetch = vi.fn(() =>
      Promise.resolve({
        json() {
          return Promise.resolve({
            access_token: "access token",
            expires_in: 3599,
            refresh_token: "refresh token",
            scope: "scope",
            token_type: "token type",
          });
        },
      } as Response),
    );

    const response = await requestAccessToken("redirect uri", "code");

    expect(response).toBeDefined();
    expect(response.accessToken).toBe("access token");
  });

  test("レスポンスが失敗", async () => {
    window.fetch = vi.fn(() =>
      Promise.resolve({
        json() {
          return Promise.resolve({
            // access_token: "access token",
            error: "error",
          });
        },
      } as Response),
    );

    const response = requestAccessToken("redirect uri", "code");

    await expect(response).rejects.toThrow("authorize failure");
  });
});
