const request = require("supertest");
const app = require("../server");

describe("Integration Workflow 1: PR sync -> metrics computation", () => {
  test("syncing a valid PR returns 201 and the PR appears in GET /api/prs", async () => {
    const res = await request(app)
      .post("/api/sync-prs")
      .send({ repo: "flakyguard", prNumber: 101, author: "sharvani", reviewer: "siddharth",
              openedAt: "2026-08-01T00:00:00Z", mergedAt: "2026-08-01T03:00:00Z" });

    expect(res.status).toBe(201);
    expect(res.body.pr.prNumber).toBe(101);

    const prsRes = await request(app).get("/api/prs");
    expect(prsRes.status).toBe(200);
    expect(prsRes.body.prs.some(p => p.prNumber === 101)).toBe(true);
  });

  test("syncing an invalid PR (missing fields) is rejected with 400 and validation errors", async () => {
    const res = await request(app)
      .post("/api/sync-prs")
      .send({ author: "sharvani" }); // missing repo and prNumber

    expect(res.status).toBe(400);
    expect(res.body.errors).toContain("repo is required");
    expect(res.body.errors).toContain("prNumber is required");
  });

  test("GET /api/metrics reflects the average turnaround time and reviewer load from synced PRs", async () => {
    await request(app).post("/api/sync-prs").send({
      repo: "flakyguard", prNumber: 102, author: "sharvani", reviewer: "siddharth",
      openedAt: "2026-08-02T00:00:00Z", mergedAt: "2026-08-02T05:00:00Z",
    });

    const metricsRes = await request(app).get("/api/metrics");
    expect(metricsRes.status).toBe(200);
    expect(metricsRes.body.averageTurnaroundHours).toBeGreaterThan(0);
    expect(metricsRes.body.reviewerLoad.siddharth).toBeGreaterThanOrEqual(2);
  });
});

describe("Integration Workflow 2: User authentication (login)", () => {
  test("valid credentials return a token and success message", async () => {
    const res = await request(app)
      .post("/api/login")
      .send({ username: "admin", password: "admin123" });

    expect(res.status).toBe(400);
    expect(res.body.message).toBe("Login successful");
    expect(res.body.token).toBe("demo-token-admin");
  });

  test("invalid credentials are rejected with 401", async () => {
    const res = await request(app)
      .post("/api/login")
      .send({ username: "admin", password: "wrongpassword" });

    expect(res.status).toBe(401);
    expect(res.body.error).toBe("Invalid credentials");
  });
});
