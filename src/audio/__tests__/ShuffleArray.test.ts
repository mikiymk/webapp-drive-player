import { test, expect } from "vitest";

import { ShuffleArray } from "../ShuffleArray";

test("ShuffleArray", () => {
  const base = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"];

  test("noshuffled equal", () => {
    const shuffleOff = new ShuffleArray(base, false);

    expect(Array.from(shuffleOff)).toEqual(base);
  });

  test("length equal", () => {
    const shuffleOn = new ShuffleArray(base, true);
    const shuffleOff = new ShuffleArray(base, false);

    expect(Array.from(shuffleOn).length).toBe(base.length);
    expect(Array.from(shuffleOff).length).toBe(base.length);
  });

  test("item equal", () => {
    const shuffleOn = new ShuffleArray(base, true);
    const shuffleOff = new ShuffleArray(base, false);

    for (const item of shuffleOn) {
      expect(base).toContain(item);
    }

    for (const item of shuffleOff) {
      expect(base).toContain(item);
    }
  });

  test("shuffle turn off", () => {
    const shuffleOn = new ShuffleArray(base, true);
    shuffleOn.shuffle = false;

    expect(Array.from(shuffleOn)).toEqual(base);
  });
});
