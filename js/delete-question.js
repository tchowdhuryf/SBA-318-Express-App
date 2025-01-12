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

// Handle question preview
document.getElementById("previewButton").addEventListener("click", () => {
  const category = document.getElementById("category").value;
  const questionId = document.getElementById("questionId").value;
  const previewElement = document.getElementById("preview");

  if (!category || !questionId) {
    previewElement.textContent =
      "Please select a category and enter a question ID.";
    return;
  }

  fetch(`/api/questions/${category}/${questionId}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Question not found.");
      }
      return response.json();
    })
    .then((data) => {
      previewElement.innerHTML = `
      <strong>Question:</strong> ${data.question}<br>
      <strong>Options:</strong><br>
      <ol>
        ${data.options.map((option) => `<li>${option}</li>`).join("")}
      </ol>
      <strong>Correct Answer:</strong> ${data.answer}
    `;
    })
    .catch((err) => {
      previewElement.textContent =
        "An error occurred or the question was not found.";
      console.error(err);
    });
});

// Handle form submission
const form = document.getElementById("deleteQuestionForm");
form.addEventListener("submit", (event) => {
  event.preventDefault();
  const category = form.category.value;
  const questionId = form.questionId.value;

  fetch(`/api/questions/${category}/${questionId}`, {
    method: "DELETE",
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to delete question.");
      }
      return response.json();
    })
    .then((data) => {
      document.getElementById("statusMessage").textContent =
        data.message || "Question deleted successfully.";
      document.getElementById("preview").innerHTML = ""; // Clear the preview
    })
    .catch((err) => {
      document.getElementById("statusMessage").textContent =
        "An error occurred while deleting the question.";
      console.error(err);
    });
});
