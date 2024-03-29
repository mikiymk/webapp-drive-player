import { render } from "solid-js/web";
import { expect, test, vi } from "vitest";

import { MusicPlayer } from "../index";

test("snapshot app", () => {
  window.AudioContext = vi.fn();
  window.fetch = vi.fn(() =>
    Promise.resolve({
      json() {
        /* eslint-disable camelcase */
        return Promise.resolve({
          access_token: "access token",
          expires_in: 3599,
          refresh_token: "refresh token",
          scope: "scope",
          token_type: "token type",
          files: [],
          nextPageToken: undefined,
        });
      },
    } as Response),
  );

  const root = document.createElement("div");
  render(MusicPlayer, root);

  expect(root).toMatchSnapshot();
});
