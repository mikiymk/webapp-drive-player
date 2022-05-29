import { test, expect } from "vitest";

import { formatTime } from "../format";

test("1 second", () => {
  expect(formatTime(1.0)).toBe("00:01");
});

test("59 seconds", () => {
  expect(formatTime(59.0)).toBe("00:59");
});

test("1 minute 1 second", () => {
  expect(formatTime(61.0)).toBe("01:01");
});

test("100 minutes 1 second", () => {
  expect(formatTime(6001.0)).toBe("100:01");
});

test("1 second 001", () => {
  expect(formatTime(1.001)).toBe("00:01");
});

test("1 second 999", () => {
  expect(formatTime(1.999)).toBe("00:01");
});

test("round 1 second 001", () => {
  expect(formatTime(1.0014)).toBe("00:01");
});
