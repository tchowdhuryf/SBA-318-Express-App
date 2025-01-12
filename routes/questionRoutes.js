const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");

// Path to the questions.json file
const questionsFilePath = path.join(__dirname, "../data/questions.json");

// Fetch all categories
router.get("/categories", (req, res) => {
  fs.readFile(questionsFilePath, "utf-8", (err, data) => {
    if (err) {
      return res.status(500).json({ error: "Could not read questions file" });
    }

    const questions = JSON.parse(data);

    // Extract category names
    const categories = Object.keys(questions.categories);
    res.json(categories);
  });
});

// Filter questions by category
router.get("/questions/:category", (req, res) => {
  const category = req.params.category;

  fs.readFile(questionsFilePath, "utf-8", (err, data) => {
    if (err) {
      return res.status(500).json({ error: "Could not read questions file" });
    }

    const questions = JSON.parse(data);

    // Check if the category exists
    if (!questions.categories[category]) {
      return res.status(404).json({ error: "Category not found" });
    }

    res.json(questions.categories[category]);
  });
});

// Fetch a question by ID in a specific category
router.get("/questions/:category/:id", (req, res) => {
  const { category, id } = req.params;

  // Read the questions.json file
  fs.readFile(questionsFilePath, "utf-8", (err, data) => {
    if (err) {
      return res.status(500).json({ error: "Error reading questions file" });
    }

    const questions = JSON.parse(data);

    // Check if the category exists
    if (!questions.categories[category]) {
      return res.status(404).json({ error: "Category not found" });
    }

    // Find the question with the given ID
    const question = questions.categories[category].find(
      (q) => q.id === parseInt(id, 10)
    );

    if (!question) {
      return res.status(404).json({ error: "Question not found" });
    }

    // Return the question
    res.json(question);
  });
});

// Add new question to a category
router.post("/questions/:category", (req, res) => {
  const category = req.params.category;
  const { question, options, answer } = req.body;

  // Validate request --this could be a middleware
  if (
    !question ||
    typeof question !== "string" ||
    !Array.isArray(options) ||
    options.length !== 4 ||
    !answer ||
    typeof answer !== "string"
  ) {
    return res.status(400).json({ error: "Invalid question format" });
  }

  // Read the questions.json file
  fs.readFile(questionsFilePath, "utf-8", (err, data) => {
    if (err) {
      return res.status(500).json({ error: "Error reading questions file" });
    }

    const questions = JSON.parse(data);

    // Check if the category exists
    if (!questions.categories[category]) {
      return res.status(404).json({ error: "Category not found" });
    }

    // Calculate the next unique ID within the category
    const categoryQuestions = questions.categories[category];
    const lastId =
      categoryQuestions.length > 0
        ? Math.max(...categoryQuestions.map((q) => q.id))
        : 0;
    const newId = lastId + 1;

    // Create a new question
    const newQuestion = { id: newId, question, options, answer };
    categoryQuestions.push(newQuestion);

    // Save the updated questions
    fs.writeFile(
      questionsFilePath,
      JSON.stringify(questions, null, 2),
      (err) => {
        if (err) {
          return res.status(500).json({ error: "Error saving question" });
        }

        res.status(200).json({
          message: "Question added successfully",
          question: newQuestion,
        });
      }
    );
  });
});

// Partially update a question by ID in a specific category
router.patch("/questions/:category/:id", (req, res) => {
  const { category, id } = req.params;
  const { question, options, answer } = req.body;

  fs.readFile(questionsFilePath, "utf-8", (err, data) => {
    if (err) {
      return res.status(500).json({ error: "Error reading questions file" });
    }

    const questions = JSON.parse(data);

    // Check if the category exists
    if (!questions.categories[category]) {
      return res.status(404).json({ error: "Category not found" });
    }

    // Find the question with the given ID
    const categoryQuestions = questions.categories[category];
    const questionIndex = categoryQuestions.findIndex(
      (q) => q.id === parseInt(id, 10)
    );

    if (questionIndex === -1) {
      return res.status(404).json({ error: "Question not found" });
    }

    // Update the specified fields
    const existingQuestion = categoryQuestions[questionIndex];
    if (question !== undefined) existingQuestion.question = question;
    if (options !== undefined && Array.isArray(options)) {
      existingQuestion.options = options;
    }
    if (answer !== undefined) existingQuestion.answer = answer;

    // Save the updated file
    fs.writeFile(
      questionsFilePath,
      JSON.stringify(questions, null, 2),
      (err) => {
        if (err) {
          return res.status(500).json({ error: "Error saving updated file" });
        }

        res.status(200).json({
          message: "Question updated successfully (PATCH)",
          updatedQuestion: existingQuestion,
        });
      }
    );
  });
});

// Fully update a question by ID in a specific category
router.put("/questions/:category/:id", (req, res) => {
  const { category, id } = req.params;
  const { question, options, answer } = req.body;

  // Validate request
  if (
    !question ||
    typeof question !== "string" ||
    !Array.isArray(options) ||
    options.length !== 4 ||
    !answer ||
    typeof answer !== "string"
  ) {
    return res.status(400).json({ error: "Invalid question format" });
  }

  fs.readFile(questionsFilePath, "utf-8", (err, data) => {
    if (err) {
      return res.status(500).json({ error: "Error reading questions file" });
    }

    const questions = JSON.parse(data);

    // Check if the category exists
    if (!questions.categories[category]) {
      return res.status(404).json({ error: "Category not found" });
    }

    // Find the question with the given ID
    const categoryQuestions = questions.categories[category];
    const questionIndex = categoryQuestions.findIndex(
      (q) => q.id === parseInt(id, 10)
    );

    if (questionIndex === -1) {
      return res.status(404).json({ error: "Question not found" });
    }

    // Replace the entire question
    const updatedQuestion = { id: parseInt(id, 10), question, options, answer };
    categoryQuestions[questionIndex] = updatedQuestion;

    // Save the updated file
    fs.writeFile(
      questionsFilePath,
      JSON.stringify(questions, null, 2),
      (err) => {
        if (err) {
          return res.status(500).json({ error: "Error saving updated file" });
        }

        res.status(200).json({
          message: "Question updated successfully (PUT)",
          updatedQuestion,
        });
      }
    );
  });
});

// Delete a question by ID in a specific category
router.delete("/questions/:category/:id", (req, res) => {
  const { category, id } = req.params;

  // Read the questions.json file
  fs.readFile(questionsFilePath, "utf-8", (err, data) => {
    if (err) {
      return res.status(500).json({ error: "Error reading questions file" });
    }

    const questions = JSON.parse(data);

    // Check if the category exists
    if (!questions.categories[category]) {
      return res.status(404).json({ error: "Category not found" });
    }

    // Find the index of the question with the given ID
    const categoryQuestions = questions.categories[category];
    const questionIndex = categoryQuestions.findIndex(
      (q) => q.id === parseInt(id, 10)
    );

    if (questionIndex === -1) {
      return res.status(404).json({ error: "Question not found" });
    }

    // Remove the question from the category
    const [deletedQuestion] = categoryQuestions.splice(questionIndex, 1);

    // Save the updated questions back to the file
    fs.writeFile(
      questionsFilePath,
      JSON.stringify(questions, null, 2),
      (err) => {
        if (err) {
          return res.status(500).json({ error: "Error saving updated file" });
        }

        res.status(200).json({
          message: "Question deleted successfully",
          deletedQuestion,
        });
      }
    );
  });
});

module.exports = router;
