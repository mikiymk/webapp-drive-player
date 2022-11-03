import { describe, expect, test, vi } from "vitest";

import { getGoogleMetadata } from "../metadata";

describe("Google Drive APIからファイルのメタデータのリストをダウンロードする関数", () => {
  test("リクエストが正しい引数で行われる", async () => {
    window.fetch = vi.fn(() =>
      Promise.resolve({
        json() {
          return Promise.resolve({
            files: [
              { id: "file-1", name: "file 1" },
              { id: "file-2", name: "file 2" },
              { id: "file-3", name: "file 3" },
              { id: "file-4", name: "file 4" },
              { id: "file-5", name: "file 5" },
            ],
            nextPageToken: undefined,
          });
        },
      } as Response)
    );

    const response = await getGoogleMetadata("access-token", "query", false);

    expect(response).toBeDefined();
    expect(window.fetch).toBeCalledTimes(1);
    expect(window.fetch).toBeCalledWith(
      "https://www.googleapis.com/drive/v3/files?fields=nextPageToken%2C%20files(id%2C%20name)&pageSize=100&orderBy=name&q=query",
      {
        headers: { Authorization: "Bearer access-token" },
      }
    );
  });

  test("リクエストが正しい引数で行われる: 複数ページ", async () => {
    window.fetch = vi.fn(url =>
      Promise.resolve({
        json() {
          const search = new URL(url as URL).searchParams;
          if (search.get("pageToken") !== "1")
            return Promise.resolve({
              files: [
                { id: "file-1", name: "file 1" },
                { id: "file-2", name: "file 2" },
                { id: "file-3", name: "file 3" },
                { id: "file-4", name: "file 4" },
                { id: "file-5", name: "file 5" },
              ],
              nextPageToken: "1",
            });
          return Promise.resolve({
            files: [
              { id: "file-6", name: "file 6" },
              { id: "file-7", name: "file 7" },
              { id: "file-8", name: "file 8" },
              { id: "file-9", name: "file 9" },
              { id: "file-0", name: "file 0" },
            ],
            nextPageToken: undefined,
          });
        },
      } as Response)
    );

    const response = await getGoogleMetadata("access-token", "query", false);

    expect(response).toBeDefined();
    expect(window.fetch).toBeCalledTimes(2);
    expect(window.fetch).toBeCalledWith(
      "https://www.googleapis.com/drive/v3/files?fields=nextPageToken%2C%20files(id%2C%20name)&pageSize=100&orderBy=name&q=query",
      {
        headers: { Authorization: "Bearer access-token" },
      }
    );
    expect(window.fetch).toBeCalledWith(
      "https://www.googleapis.com/drive/v3/files?fields=nextPageToken%2C%20files(id%2C%20name)&pageSize=100&pageToken=1&orderBy=name&q=query",
      {
        headers: { Authorization: "Bearer access-token" },
      }
    );
  });

  test("レスポンスのファイルをまとめて返す", async () => {
    window.fetch = vi.fn(() =>
      Promise.resolve({
        json: () =>
          Promise.resolve({
            files: [
              { id: "file-1", name: "file 1" },
              { id: "file-2", name: "file 2" },
              { id: "file-3", name: "file 3" },
              { id: "file-4", name: "file 4" },
              { id: "file-5", name: "file 5" },
            ],
            nextPageToken: undefined,
          }),
      } as Response)
    );

    const response = await getGoogleMetadata("access-token", "query", false);

    expect(response).toBeDefined();

    expect(response).toHaveLength(5);
    expect(response).toEqual([
      { id: "file-1", name: "file 1" },
      { id: "file-2", name: "file 2" },
      { id: "file-3", name: "file 3" },
      { id: "file-4", name: "file 4" },
      { id: "file-5", name: "file 5" },
    ]);
  });

  test("レスポンスのファイルをまとめて返す: 複数ページ", async () => {
    window.fetch = vi.fn(url =>
      Promise.resolve({
        json() {
          const search = new URL(url as URL).searchParams;
          if (search.get("pageToken") !== "1")
            return Promise.resolve({
              files: [
                { id: "file-1", name: "file 1" },
                { id: "file-2", name: "file 2" },
                { id: "file-3", name: "file 3" },
                { id: "file-4", name: "file 4" },
                { id: "file-5", name: "file 5" },
              ],
              nextPageToken: "1",
            });
          return Promise.resolve({
            files: [
              { id: "file-6", name: "file 6" },
              { id: "file-7", name: "file 7" },
              { id: "file-8", name: "file 8" },
              { id: "file-9", name: "file 9" },
              { id: "file-0", name: "file 0" },
            ],
            nextPageToken: undefined,
          });
        },
      } as Response)
    );

    const response = await getGoogleMetadata("access-token", "query", false);

    expect(response).toBeDefined();

    expect(response).toHaveLength(10);
    expect(response).toEqual([
      { id: "file-1", name: "file 1" },
      { id: "file-2", name: "file 2" },
      { id: "file-3", name: "file 3" },
      { id: "file-4", name: "file 4" },
      { id: "file-5", name: "file 5" },
      { id: "file-6", name: "file 6" },
      { id: "file-7", name: "file 7" },
      { id: "file-8", name: "file 8" },
      { id: "file-9", name: "file 9" },
      { id: "file-0", name: "file 0" },
    ]);
  });
});
