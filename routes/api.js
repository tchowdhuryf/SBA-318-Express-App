const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

// Load questions
const questionsPath = path.join(__dirname, '../data/questions.json');

// Fetch questions by category
router.get('/questions/:category', (req, res) => {
  const category = req.params.category;
  const data = JSON.parse(fs.readFileSync(questionsPath));
  if (data.categories[category]) {
    const questions = data.categories[category];
    res.json(questions[Math.floor(Math.random() * questions.length)]);
  } else {
    res.status(404).json({ error: 'Category not found' });
  }
});

module.exports = router;
