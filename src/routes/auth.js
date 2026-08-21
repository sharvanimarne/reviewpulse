const express = require("express");
const router = express.Router();

const users = [{ username: "admin", password: "admin123" }];

router.post("/login", (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username && u.password === password);
  if (!user) {
    return res.status(401).json({ error: "Invalid credentials" });
  }
  return res.json({ message: "Login successful", token: `demo-token-${username}` });
});

module.exports = { router };
