const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");
const error = require("../utilities/error")

// Path to the leaderboard.json file
const leaderboardFilePath = path.join(__dirname, "../data/leaderboard.json");

// Middleware for validating leaderboard category
function validateCategory(req, res, next) {
    const category = req.params.category;
  
    fs.readFile(leaderboardFilePath, "utf-8", (err, data) => {
      if (err) {
        return res.status(500).json({ error: "Could not read leaderboard file" });
      }

      const leaderboard = JSON.parse(data);
  
      if (!leaderboard.categories[category]) {
        return res.status(404).json({ error: "Category not found" });
      }
  
      req.categoryData = leaderboard.categories[category];
      next();
    });
  }

// Fetch all leaderboard entries in a category
router.get("/leaderboard/:category", validateCategory,(req, res) => {
  const category = req.params.category;

  // Read the leaderboard.json file
  fs.readFile(leaderboardFilePath, "utf-8", (err, data) => {
    if (err) {
      return res.status(500).json({ error: "Could not read leaderboard file" });
    }

    const leaderboard = JSON.parse(data);

    // Check if the category exists
    if (!leaderboard.categories[category]) {
      return res.status(404).json({ error: "Category not found" });
    }

    // Return all entries in the category sorted by score
    const topEntries = leaderboard.categories[category]
      .sort((a, b) => b.score - a.score)
      .slice(0, 10);
    res.json(topEntries);
  });
});

// Add a new leaderboard entry to a category
router.post("/leaderboard/:category", (req, res) => {
  const category = req.params.category;
  const { username, score } = req.body;

  // Validate request
  if (!username || typeof score !== "number") {
    return res.status(400).json({ error: "Invalid username or score" });
  }

  // Read the leaderboard.json file
  fs.readFile(leaderboardFilePath, "utf-8", (err, data) => {
    if (err) {
      return res.status(500).json({ error: "Error reading leaderboard file" });
    }

    const leaderboard = JSON.parse(data);

    // Check if the category exists, and initialize if not
    if (!leaderboard.categories[category]) {
      leaderboard.categories[category] = [];
    }

    // Calculate the next unique ID within the category
    const categoryEntries = leaderboard.categories[category];
    const lastId =
      categoryEntries.length > 0
        ? Math.max(...categoryEntries.map((entry) => entry.id))
        : 0;
    const newId = lastId + 1;

    // Create a new leaderboard entry
    const newEntry = { id: newId, username, score };
    categoryEntries.push(newEntry);

    // Save the updated leaderboard
    fs.writeFile(
      leaderboardFilePath,
      JSON.stringify(leaderboard, null, 2),
      (err) => {
        if (err) {
          return res
            .status(500)
            .json({ error: "Error saving leaderboard file" });
        }

        res.status(200).json({
          message: "Leaderboard entry added successfully",
          entry: newEntry,
        });
      }
    );
  });
});

// Delete a leaderboard entry by ID in a specific category
router.delete("/leaderboard/:category/:id", (req, res) => {
  const { category, id } = req.params;

  // Read the leaderboard.json file
  fs.readFile(leaderboardFilePath, "utf-8", (err, data) => {
    if (err) {
      return res.status(500).json({ error: "Error reading leaderboard file" });
    }

    const leaderboard = JSON.parse(data);

    // Check if the category exists
    if (!leaderboard.categories[category]) {
      return res.status(404).json({ error: "Category not found" });
    }

    // Find the index of the entry with the given ID
    const categoryEntries = leaderboard.categories[category];
    const entryIndex = categoryEntries.findIndex(
      (entry) => entry.id === parseInt(id, 10)
    );

    if (entryIndex === -1) {
      return res.status(404).json({ error: "Entry not found" });
    }

    // Remove the entry from the category
    const [deletedEntry] = categoryEntries.splice(entryIndex, 1);

    // Save the updated leaderboard
    fs.writeFile(
      leaderboardFilePath,
      JSON.stringify(leaderboard, null, 2),
      (err) => {
        if (err) {
          return res.status(500).json({ error: "Error saving updated file" });
        }

        res.status(200).json({
          message: "Leaderboard entry deleted successfully",
          deletedEntry,
        });
      }
    );
  });
});

module.exports = router;
