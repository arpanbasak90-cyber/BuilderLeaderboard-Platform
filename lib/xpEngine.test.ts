import { describe, it, expect } from "vitest";
import { calculateLevel, getXPProgress, getXPForNextLevel, XP_PER_LEVEL } from "./xpEngine";

describe("calculateLevel", () => {
  it("returns level 0 for XP below one level threshold", () => {
    expect(calculateLevel(499)).toBe(0);
  });

  it("returns correct level for exact multiples of XP_PER_LEVEL", () => {
    expect(calculateLevel(1000)).toBe(2);
  });

  it("floors partial progress into the current level", () => {
    expect(calculateLevel(1250)).toBe(2);
  });
});

describe("getXPProgress", () => {
  it("calculates correct progress within a level", () => {
    const result = getXPProgress(250);
    expect(result.current).toBe(250);
    expect(result.needed).toBe(XP_PER_LEVEL);
    expect(result.percentage).toBe(50);
  });

  it("caps percentage at 100 even with edge-case input", () => {
    const result = getXPProgress(0);
    expect(result.percentage).toBeLessThanOrEqual(100);
  });
});

describe("getXPForNextLevel", () => {
  it("returns the XP threshold for the next level up", () => {
    expect(getXPForNextLevel(0)).toBe(500);
  });

  it("returns correct next threshold from mid-level XP", () => {
    expect(getXPForNextLevel(600)).toBe(1000);
  });
});