import { test, expect, vi } from "vitest";

import { AudioInfo } from "../AudioInfo";

test("AudioInfo empty", () => {
  const emptyInfo = AudioInfo.getEmptyInfo();

  expect(emptyInfo).toHaveProperty("title");
  expect(emptyInfo).toHaveProperty("artists");
  expect(emptyInfo).toHaveProperty("album");
  expect(emptyInfo).toHaveProperty("albumartist");
  expect(emptyInfo).toHaveProperty("track");
  expect(emptyInfo).toHaveProperty("disk");
  expect(emptyInfo).toHaveProperty("date");
  expect(emptyInfo).toHaveProperty("genre");
  expect(emptyInfo).toHaveProperty("picture");
  expect(emptyInfo).toHaveProperty("sort");
});

test("AudioInfo blob", async () => {
  const mock = vi.spyOn(console, "log").mockImplementation(() => void 0);
  const blobInfo = await AudioInfo.getInfo(new Blob());
  expect(mock).toHaveBeenCalledTimes(2);

  expect(blobInfo).toHaveProperty("title");
  expect(blobInfo).toHaveProperty("artists");
  expect(blobInfo).toHaveProperty("album");
  expect(blobInfo).toHaveProperty("albumartist");
  expect(blobInfo).toHaveProperty("track");
  expect(blobInfo).toHaveProperty("disk");
  expect(blobInfo).toHaveProperty("date");
  expect(blobInfo).toHaveProperty("genre");
  expect(blobInfo).toHaveProperty("picture");
  expect(blobInfo).toHaveProperty("sort");
  expect(blobInfo).toEqual(AudioInfo.getEmptyInfo());
});
