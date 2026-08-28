const express = require("express");
const router = express.Router();
const { validatePRPayload } = require("../utils/validate");

// In-memory store of synced PRs (for demo purposes)
const pullRequests = [];

// POST /sync-prs
// Accepts PR metadata (normally pulled from GitHub/GitLab API):
// { repo, prNumber, author, reviewer, openedAt, mergedAt }
router.post("/sync-prs", (req, res) => {
  const { valid, errors } = validatePRPayload(req.body);
  if (!valid) {
    return res.status(400).json({ errors });
  }

  const { repo, prNumber, author, reviewer, openedAt, mergedAt } = req.body;
  const pr = { repo, prNumber, author, reviewer: reviewer || null, openedAt, mergedAt: mergedAt || null };
  pullRequests.push(pr);
  return res.status(201).json({ message: "PR synced", pr });
});

router.get("/prs", (req, res) => {
  res.json({ count: pullRequests.length, prs: pullRequests });
});

module.exports = { router, pullRequests };
