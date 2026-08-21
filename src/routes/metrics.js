const express = require("express");
const router = express.Router();
const { averageTurnaroundHours, reviewerLoad } = require("../utils/metrics");
const { pullRequests } = require("./sync");

// GET /metrics — returns average turnaround time and per-reviewer load
router.get("/metrics", (req, res) => {
  res.json({
    averageTurnaroundHours: averageTurnaroundHours(pullRequests),
    reviewerLoad: reviewerLoad(pullRequests),
  });
});

module.exports = { router };
