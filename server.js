const express = require("express");

const app = express();
const path = require("path");

app.use(express.static(path.join(__dirname, "frontend/build")));

const port = process.env.PORT || 5000;

app.get("/api/auth", (req, res) => {
  res.json({ message: "Success" });
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend/build/index.html"));
});

app.listen(port, () => console.log(`Listening on port ${port}`));
