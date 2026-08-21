const express = require("express");
const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ status: "ReviewPulse API running" });
});

module.exports = app;

if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => console.log(`ReviewPulse listening on port ${PORT}`));
}

const { router: metricsRouter } = require("./src/routes/metrics");
app.use("/api", metricsRouter);
