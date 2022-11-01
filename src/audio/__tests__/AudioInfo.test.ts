import { expect, test } from "vitest";

import { AudioInfo } from "../AudioInfo";

test("AudioInfo empty", () => {
  const emptyInfo = AudioInfo.getEmptyInfo();

  expect(emptyInfo).toHaveProperty("title");
  expect(emptyInfo).toHaveProperty("artists");
  expect(emptyInfo).toHaveProperty("album");
  expect(emptyInfo).toHaveProperty("albumartist");
  expect(emptyInfo).toHaveProperty("track");
  expect(emptyInfo).toHaveProperty("disk");
  expect(emptyInfo).toHaveProperty("duration");
  expect(emptyInfo).toHaveProperty("picture");
  expect(emptyInfo).toHaveProperty("sort");
});
