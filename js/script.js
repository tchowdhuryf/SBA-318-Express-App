let currentQuestionIndex = 0;
let questions = [];
let score = 0;
let currentCategory = "";

async function startGame(category) {
  try {
    currentCategory = category;
    const response = await fetch(`/api/questions/${category}`);
    questions = await response.json();

    if (!Array.isArray(questions) || questions.length === 0) {
      console.error("No questions found for this category.");
      return;
    }

    currentQuestionIndex = 0;
    displayQuestion(questions[currentQuestionIndex]);
  } catch (error) {
    console.error("Error fetching questions:", error);
  }
}

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function displayQuestion(question) {
  document.getElementById("game-container").style.display = "none";
  const questionContainer = document.getElementById("question-container");
  questionContainer.style.display = "block";

  document.getElementById("question").innerText = question.question;
  const options = document.getElementById("options");
  options.innerHTML = "";

  const shuffleOptions = shuffle([...question.options]);

  shuffleOptions.forEach((option) => {
    const list = document.createElement("li");
    list.innerText = option;
    list.onclick = () => checkAnswer(list, question.answer);
    options.appendChild(list);
  });
  updateNavigationButton();
}

function checkAnswer(selectedElement, correct) {
  const options = document.querySelectorAll("#options li");

  options.forEach((option) => {
    option.style.pointerEvents = "none"; //cannot click options after one is selected

    if (option.innerText === correct) {
      option.style.backgroundColor = "#7ddf64";
      option.style.color = "white";
      if (option === selectedElement) {
        score++;
      }
    } else if (option === selectedElement) {
      option.style.backgroundColor = "#ed4d6e";
      option.style.color = "white";
    }
  });

  if (currentQuestionIndex === questions.length - 1) {
    endGame();
  }
}

//disable button on last question
function updateNavigationButton() {
  document.getElementById("next-btn").disabled =
    currentQuestionIndex === questions.length - 1;
}

function nextQuestion() {
  if (currentQuestionIndex < questions.length - 1) {
    currentQuestionIndex++;
    displayQuestion(questions[currentQuestionIndex]);
  }
}

function endGame() {
  const questionContainer = document.getElementById("question-container");
  questionContainer.style.display = "none";

  const endContainer = document.getElementById("end-container");
  endContainer.style.display = "block";
  document.getElementById("final-score").innerText = `Your score: ${score}`;

  setupSaveScoreForm();
}

function setupSaveScoreForm() {
  const saveScoreForm = document.getElementById("save-score-form");
  saveScoreForm.onsubmit = async (event) => {
    event.preventDefault();

    const username = document.getElementById("username").value.trim();
    if (!username) {
      alert("Please enter your name.");
      return;
    }

    try {
      const response = await fetch(`/api/leaderboard/${currentCategory}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, score }),
      });

      if (!response.ok) {
        throw new Error("Failed to save score.");
      }

      alert("Score saved successfully!");
      window.location.href = "pages/leaderboard.html";
    } catch (error) {
      console.error("Error saving score:", error);
      alert("An error occurred while saving your score.");
    }
  };
}
