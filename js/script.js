async function startGame(category) {
  const response = await fetch(`api/questions/${category}`);
  const question = await response.json();
  console.log(response);
  displayQuestion(question);
}

function displayQuestion(question) {
  document.getElementById("game-container").style.display = "none";
  const questionContainer = document.getElementById("question-container");
  questionContainer.style.display = "block";

  document.getElementById("question").innerText = question.question;
  const options = document.getElementById("options");
  options.innerHTML = "";

  question.options.forEach((option) => {
    const list = document.createElement("li");
    list.innerText = option;
    list.onclick = () => checkAnswer(list, question.answer);
    options.appendChild(list);
  });
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
