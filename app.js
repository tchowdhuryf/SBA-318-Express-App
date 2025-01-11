const express = require("express");
const path = require("path");
const apiRoutes = require("./routes/api");

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());
app.use(express.static(__dirname));

// API Routes
app.use("/api", apiRoutes);

// Homepage
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// Start Server
app.listen(PORT, () => {
  console.log(`Trivia app running at http://localhost:${PORT}`);
});