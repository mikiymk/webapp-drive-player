import { describe, expect, test, vi } from "vitest";

import { getGoogleFile } from "../file";

describe("Google Drive APIからファイルデータをダウンロードする関数", () => {
  test("リクエストが正しい引数で行われる", async () => {
    window.fetch = vi.fn(url => Promise.resolve({ url, ok: true } as Response));

    const response = await getGoogleFile("access-token", "file-id");

    expect(response).toBeDefined();
    expect(window.fetch).toBeCalledWith(
      "https://www.googleapis.com/drive/v3/files/file-id?alt=media",
      {
        headers: { Authorization: "Bearer access-token" },
      }
    );
  });

  test("レスポンスが正しいURLで返る", async () => {
    window.fetch = vi.fn(url => Promise.resolve({ url, ok: true } as Response));

    const response = await getGoogleFile("access-token", "file-id");

    expect(response).toBeDefined();
    expect(response!.url).toBe(
      "https://www.googleapis.com/drive/v3/files/file-id?alt=media"
    );
  });

  test("失敗: アクセストークンが未定義", async () => {
    window.fetch = vi.fn(url => Promise.resolve({ url, ok: true } as Response));

    const response = await getGoogleFile(undefined, "file-id");

    expect(response).toBeUndefined();
  });

  test("失敗: レスポンスエラー", async () => {
    window.fetch = vi.fn(url =>
      Promise.resolve({ url, ok: false } as Response)
    );

    const response = await getGoogleFile("access-token", "file-id");

    expect(response).toBeUndefined();
  });

  test("失敗: ネットワークエラー", async () => {
    window.fetch = vi.fn(() => Promise.reject("rejected!"));

    const response = await getGoogleFile("access-token", "file-id");

    expect(response).toBeUndefined();
  });
});
