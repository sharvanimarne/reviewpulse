const { validatePRPayload } = require("../src/utils/validate");

describe("validatePRPayload", () => {
  test("returns valid: true for a correct payload", () => {
    const result = validatePRPayload({ repo: "flakyguard", prNumber: 12, author: "sharvani" });
    expect(result.valid).toBe(true);
    expect(result.errors).toEqual([]);
  });

  test("flags missing repo", () => {
    const result = validatePRPayload({ prNumber: 12, author: "sharvani" });
    expect(result.valid).toBe(false);
    expect(result.errors).toContain("repo is required");
  });

  test("flags missing prNumber", () => {
    const result = validatePRPayload({ repo: "flakyguard", author: "sharvani" });
    expect(result.valid).toBe(false);
    expect(result.errors).toContain("prNumber is required");
  });

  test("flags missing author", () => {
    const result = validatePRPayload({ repo: "flakyguard", prNumber: 12 });
    expect(result.valid).toBe(false);
    expect(result.errors).toContain("author is required");
  });

  test("accumulates multiple errors when several fields are invalid", () => {
    const result = validatePRPayload({});
    expect(result.valid).toBe(false);
    expect(result.errors.length).toBeGreaterThanOrEqual(3);
  });
});
