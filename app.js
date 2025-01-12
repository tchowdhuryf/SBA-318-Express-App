const express = require("express");
const path = require("path");
const questionRoutes = require("./routes/questionRoutes");
const leaderboardRoutes = require("./routes/leaderboardRoutes");

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());
app.use(express.static(__dirname));

//logging middleware - custom
const loggingMidddleware =((req, res, next) => {
  const time = new Date();

  console.log(
    `-----
${time.toLocaleTimeString()}: Received a ${req.method} request to ${req.url}.`
  );
  if (Object.keys(req.body).length > 0) {
    console.log("Containing the data:");
    console.log(`${JSON.stringify(req.body)}`);
  }
  next();
});

// API Routes
app.use("/api", questionRoutes);
app.use("/api", leaderboardRoutes);
app.use(loggingMidddleware);

// Homepage
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// Start Server
app.listen(PORT, () => {
  console.log(`Trivia app running at http://localhost:${PORT}`);
});
