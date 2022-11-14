import { expect, test } from "vitest";

import { ShuffleArray } from "../ShuffleArray";

test("ShuffleArray", () => {
  const base = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"];

  test("シャッフルがオフの場合、元の配列と同じになる", () => {
    const shuffleOff = new ShuffleArray(base, false);

    expect(Array.from(shuffleOff)).toEqual(base);
  });

  test("元の配列と同じ長さになる", () => {
    const shuffleOn = new ShuffleArray(base, true);
    const shuffleOff = new ShuffleArray(base, false);

    expect(Array.from(shuffleOn).length).toBe(base.length);
    expect(Array.from(shuffleOff).length).toBe(base.length);
  });

  test("元の配列と同じ要素を持つ", () => {
    const shuffleOn = new ShuffleArray(base, true);
    const shuffleOff = new ShuffleArray(base, false);

    for (const item of base) {
      expect(Array.from(shuffleOn)).toContain(item);
      expect(Array.from(shuffleOff)).toContain(item);
    }

    for (const item of shuffleOn) {
      expect(base).toContain(item);
    }

    for (const item of shuffleOff) {
      expect(base).toContain(item);
    }
  });

  test("作成後にシャッフルをオフにした場合、元の配列と同じになる", () => {
    const shuffleOn = new ShuffleArray(base, true);
    shuffleOn.shuffle = false;

    expect(Array.from(shuffleOn)).toEqual(base);
  });
});
