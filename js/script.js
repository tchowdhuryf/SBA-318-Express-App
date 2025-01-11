async function startGame(category) {
    const response = await fetch(`api/questions/${category}`);
    const question = await response.json();
    console.log(response);
    displayQuestion(question);
  }
  
  function displayQuestion(question) {
    document.getElementById('game-container').style.display = 'none';
    const questionContainer = document.getElementById('question-container');
    questionContainer.style.display = 'block';
  
    document.getElementById('question').innerText = question.question;
    const options = document.getElementById('options');
    options.innerHTML = '';
  
    question.options.forEach(option => {
      const li = document.createElement('li');
      li.innerText = option;
      li.onclick = () => checkAnswer(option, question.answer);
      options.appendChild(li);
    });
  }
  
  function checkAnswer(selected, correct) {
    if (selected === correct) {
      alert('Correct!');
    } else {
      alert('Wrong!');
    }
  }
  