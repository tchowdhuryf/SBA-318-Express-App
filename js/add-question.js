// Load categories dynamically
fetch("/api/categories")
  .then((response) => response.json())
  .then((categories) => {
    const categorySelect = document.getElementById("category");
    categories.forEach((category) => {
      const option = document.createElement("option");
      option.value = category;
      option.textContent = category;
      categorySelect.appendChild(option);
    });
  });

// Handle form submission
const form = document.getElementById("addQuestionForm");
form.addEventListener("submit", (event) => {
  event.preventDefault();
  const category = form.category.value;
  const questionData = {
    question: form.question.value,
    options: [
      form.option1.value,
      form.option2.value,
      form.option3.value,
      form.option4.value,
    ],
    answer: form.answer.value,
  };

  fetch(`/api/questions/${category}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(questionData),
  })
    .then((response) => {
      if (response.ok) {
        return response.json();
      }
      throw new Error("Failed to add question.");
    })
    .then((data) => {
      document.getElementById("statusMessage").textContent =
        data.message || "Question added successfully.";
      form.reset(); // Reset form fields after successful submission
    })
    .catch((err) => {
      document.getElementById("statusMessage").textContent =
        "An error occurred while adding the question.";
      console.error(err);
    });
});
