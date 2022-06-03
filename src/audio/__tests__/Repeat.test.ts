import { describe, expect, test } from "vitest";

import { Repeat } from "../Repeat";

describe("Repeat", () => {
  let item = Repeat.ON;
  test("repeat on", () => {
    expect(item.toggle()).not.toEqual(item);
    expect(item.toggle().toggle()).not.toEqual(item);
    expect(item.toggle().toggle().toggle()).toEqual(item);
  });

  item = Repeat.OFF;
  test("repeat off", () => {
    expect(item.toggle()).not.toEqual(item);
    expect(item.toggle().toggle()).not.toEqual(item);
    expect(item.toggle().toggle().toggle()).toEqual(item);
  });

  item = Repeat.ONE;
  test("repeat one", () => {
    expect(item.toggle()).not.toEqual(item);
    expect(item.toggle().toggle()).not.toEqual(item);
    expect(item.toggle().toggle().toggle()).toEqual(item);
  });

  item = Repeat.DEFAULT;
  test("repeat default", () => {
    expect(item.toggle()).not.toEqual(item);
    expect(item.toggle().toggle()).not.toEqual(item);
    expect(item.toggle().toggle().toggle()).toEqual(item);
  });
});
