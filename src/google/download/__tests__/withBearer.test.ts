import { describe, expect, test, vi } from "vitest";

import { fetchGetWithBearer } from "../withBearer";

describe("`fetch` method with Authorization header Bearer token", () => {
  const url = "https://example.com/";
  const accessToken = "access-token";

  test("fetch url", async () => {
    window.fetch = vi.fn(url => Promise.resolve({ url } as Response));

    const response = await fetchGetWithBearer(url, accessToken);

    expect(response.url).toBe(url);
  });

  test("fetch header", async () => {
    window.fetch = vi.fn(url => Promise.resolve({ url } as Response));

    await fetchGetWithBearer(url, accessToken);

    expect(window.fetch).toBeCalledWith(url, {
      headers: { Authorization: "Bearer access-token" },
    });
  });
});
