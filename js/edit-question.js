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

      // Pre-fill the form with existing question data
      document.getElementById("question").value = data.question;
      document.getElementById("option1").value = data.options[0] || "";
      document.getElementById("option2").value = data.options[1] || "";
      document.getElementById("option3").value = data.options[2] || "";
      document.getElementById("option4").value = data.options[3] || "";
      document.getElementById("answer").value = data.answer || "";
    })
    .catch((err) => {
      previewElement.textContent =
        "An error occurred or the question was not found.";
      console.error(err);
    });
});

// Handle PATCH request
document.getElementById("patchButton").addEventListener("click", () => {
  const category = document.getElementById("category").value;
  const id = document.getElementById("questionId").value;

  const updatedFields = {};
  if (document.getElementById("question").value)
    updatedFields.question = document.getElementById("question").value;

  const options = [
    document.getElementById("option1").value,
    document.getElementById("option2").value,
    document.getElementById("option3").value,
    document.getElementById("option4").value,
  ].filter((opt) => opt !== "");
  if (options.length) updatedFields.options = options;

  if (document.getElementById("answer").value)
    updatedFields.answer = document.getElementById("answer").value;

  fetch(`/api/questions/${category}/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updatedFields),
  })
    .then((response) => response.json())
    .then((data) => {
      document.getElementById("statusMessage").textContent =
        data.message || "Error updating question.";
    })
    .catch((err) => {
      document.getElementById("statusMessage").textContent =
        "An error occurred.";
      console.error(err);
    });
});

// Handle PUT request
document.getElementById("putButton").addEventListener("click", () => {
  const category = document.getElementById("category").value;
  const id = document.getElementById("questionId").value;

  const updatedQuestion = {
    question: document.getElementById("question").value,
    options: [
      document.getElementById("option1").value,
      document.getElementById("option2").value,
      document.getElementById("option3").value,
      document.getElementById("option4").value,
    ],
    answer: document.getElementById("answer").value,
  };

  fetch(`/api/questions/${category}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updatedQuestion),
  })
    .then((response) => response.json())
    .then((data) => {
      document.getElementById("statusMessage").textContent =
        data.message || "Error replacing question.";
    })
    .catch((err) => {
      document.getElementById("statusMessage").textContent =
        "An error occurred.";
      console.error(err);
    });
});
