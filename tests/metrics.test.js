const { averageTurnaroundHours, reviewerLoad, flagBottleneck } = require("../src/utils/metrics");

describe("averageTurnaroundHours", () => {
  test("returns 0 when there are no closed PRs", () => {
    expect(averageTurnaroundHours([])).toBe(0);
    expect(averageTurnaroundHours([{ openedAt: "2026-01-01T00:00:00Z" }])).toBe(0);
  });

  test("computes average turnaround in hours for closed PRs", () => {
    const prs = [
      { openedAt: "2026-01-01T00:00:00Z", mergedAt: "2026-01-01T02:00:00Z" }, // 2h
      { openedAt: "2026-01-01T00:00:00Z", mergedAt: "2026-01-01T04:00:00Z" }, // 4h
    ];
    expect(averageTurnaroundHours(prs)).toBe(3);
  });

  test("excludes still-open PRs from the average", () => {
    const prs = [
      { openedAt: "2026-01-01T00:00:00Z", mergedAt: "2026-01-01T02:00:00Z" }, // 2h
      { openedAt: "2026-01-01T00:00:00Z", mergedAt: null }, // still open
    ];
    expect(averageTurnaroundHours(prs)).toBe(2);
  });
});

describe("reviewerLoad", () => {
  test("counts PRs per reviewer", () => {
    const prs = [
      { reviewer: "alice" }, { reviewer: "alice" }, { reviewer: "bob" }, { reviewer: null },
    ];
    expect(reviewerLoad(prs)).toEqual({ alice: 2, bob: 1 });
  });

  test("returns an empty object when there are no PRs", () => {
    expect(reviewerLoad([])).toEqual({});
  });
});

// --- TDD: new requirement — flag a bottleneck when avg turnaround exceeds a threshold ---
describe("flagBottleneck", () => {
  test("returns true when average turnaround exceeds the threshold", () => {
    expect(flagBottleneck(30, 24)).toBe(true);
  });

  test("returns false when average turnaround is within the threshold", () => {
    expect(flagBottleneck(10, 24)).toBe(false);
  });

  test("uses a default threshold of 24 hours when none is provided", () => {
    expect(flagBottleneck(25)).toBe(true);
    expect(flagBottleneck(5)).toBe(false);
  });
});
