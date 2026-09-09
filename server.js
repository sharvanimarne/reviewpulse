const express = require("express");
const app = express();
app.use(express.json());

const { router: syncRouter } = require("./src/routes/sync");
const { router: metricsRouter } = require("./src/routes/metrics");
const { router: authRouter } = require("./src/routes/auth");

app.get("/", (req, res) => {
  res.json({ status: "ReviewPulse API v1.0 - live and healthy" });
});

app.use("/api", syncRouter);
app.use("/api", metricsRouter);
app.use("/api", authRouter);

module.exports = app;

if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => console.log(`ReviewPulse listening on port ${PORT}`));
}
