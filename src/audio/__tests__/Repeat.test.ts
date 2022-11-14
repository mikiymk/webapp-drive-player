import { describe, expect, test } from "vitest";

import {
  RepeatDefault,
  RepeatOff,
  RepeatOn,
  RepeatOne,
  toggleRepeat,
} from "../Repeat";

import type { RepeatType } from "../Repeat";

describe("リピート切り替え3回で戻る", () => {
  let item: RepeatType = RepeatOn;
  test("repeat on", () => {
    expect(toggleRepeat(item)).not.toEqual(item);
    expect(toggleRepeat(toggleRepeat(item))).not.toEqual(item);
    expect(toggleRepeat(toggleRepeat(toggleRepeat(item)))).toEqual(item);
  });

  item = RepeatOff;
  test("repeat off", () => {
    expect(toggleRepeat(item)).not.toEqual(item);
    expect(toggleRepeat(toggleRepeat(item))).not.toEqual(item);
    expect(toggleRepeat(toggleRepeat(toggleRepeat(item)))).toEqual(item);
  });

  item = RepeatOne;
  test("repeat one", () => {
    expect(toggleRepeat(item)).not.toEqual(item);
    expect(toggleRepeat(toggleRepeat(item))).not.toEqual(item);
    expect(toggleRepeat(toggleRepeat(toggleRepeat(item)))).toEqual(item);
  });

  item = RepeatDefault;
  test("repeat default", () => {
    expect(toggleRepeat(item)).not.toEqual(item);
    expect(toggleRepeat(toggleRepeat(item))).not.toEqual(item);
    expect(toggleRepeat(toggleRepeat(toggleRepeat(item)))).toEqual(item);
  });
});
