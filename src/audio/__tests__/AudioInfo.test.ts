import { expect, test } from "vitest";

import { emptyInfo } from "../AudioInfo";

test("AudioInfo empty", () => {
  const info = emptyInfo();

  expect(info).toHaveProperty("title");
  expect(info).toHaveProperty("artists");
  expect(info).toHaveProperty("album");
  expect(info).toHaveProperty("albumartist");
  expect(info).toHaveProperty("track");
  expect(info).toHaveProperty("disk");
  expect(info).toHaveProperty("date");
  expect(info).toHaveProperty("genre");
  expect(info).toHaveProperty("picture");
  expect(info).toHaveProperty("sort");
});

// test("AudioInfo blob", async () => {
//   const mock = vi.spyOn(console, "log").mockImplementation(() => void 0);
//   const blobInfo = await AudioInfo.getInfo(new Blob());
//   expect(mock).toHaveBeenCalledTimes(2);

//   expect(blobInfo).toHaveProperty("title");
//   expect(blobInfo).toHaveProperty("artists");
//   expect(blobInfo).toHaveProperty("album");
//   expect(blobInfo).toHaveProperty("albumartist");
//   expect(blobInfo).toHaveProperty("track");
//   expect(blobInfo).toHaveProperty("disk");
//   expect(blobInfo).toHaveProperty("date");
//   expect(blobInfo).toHaveProperty("genre");
//   expect(blobInfo).toHaveProperty("picture");
//   expect(blobInfo).toHaveProperty("sort");
//   expect(blobInfo).toEqual(AudioInfo.getEmptyInfo());
// });
