let currentQuestionIndex = 0;
let questions = [];

async function startGame(category) {
  try {
    const response = await fetch(`/api/questions/${category}`);
    questions = await response.json();

    if (!Array.isArray(questions) || questions.length === 0) {
      console.error("No questions found for this category.");
      return;
    }

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
      option.style.backgroundColor = "#03C03C";
      option.style.color = "white";
    } else if (option === selectedElement) {
      option.style.backgroundColor = "#ED1B24";
      option.style.color = "white";
    }
  });
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
