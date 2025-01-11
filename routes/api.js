const express = require("express");
const router = express.Router();
const questions = require("../data/questions");

router.get("/questions/:category", (req, res) => {
  const category = req.params.category;

  if (questions.categories[category]) {
    const categoryQuestions = questions.categories[category];
    const randomQuestion =
      categoryQuestions[Math.floor(Math.random() * categoryQuestions.length)];
    res.json(randomQuestion); // Return a random question from the category
  } else {
    res.status(404).json({ error: "Category not found" });
  }
});

module.exports = router;
