// Fetch categories and populate the dropdown
fetch("/api/categories")
.then((response) => response.json())
.then((categories) => {
  const categorySelector = document.getElementById("categorySelector");
  const controls = document.getElementById("controls");

  if (categories.length > 0) {
    categories.forEach((category) => {
      const option = document.createElement("option");
      option.value = category;
      option.textContent = category;
      categorySelector.appendChild(option);
    });

    // Automatically load leaderboard for the first category
    categorySelector.value = categories[0];
    loadLeaderboard(categories[0]);
    controls.style.display = "block"; // Show dropdown controls only if categories are valid

    // Update leaderboard when a new category is selected
    categorySelector.addEventListener("change", () =>
      loadLeaderboard(categorySelector.value)
    );
  } else {
    showErrorMessage("No categories available.");
  }
})
.catch((error) => {
  console.error("Error fetching categories:", error);
  showErrorMessage(
    "Failed to load categories. Please try again later."
  );
});

// Fetch and display the leaderboard for the selected category
function loadLeaderboard(category) {
fetch(`/api/leaderboard/${category}`)
  .then((response) => {
    if (!response.ok) {
      throw new Error("Failed to fetch leaderboard");
    }
    return response.json();
  })
  .then((leaderboard) => {
    const table = document.getElementById("leaderboardTable");
    const tableBody = table.querySelector("tbody");
    const errorMessage = document.getElementById("errorMessage");

    tableBody.innerHTML = ""; // Clear previous table rows
    errorMessage.style.display = "none";
    table.style.display = "none"; // Hide table by default

    if (leaderboard.length === 0) {
      showErrorMessage(
        "No leaderboard entries found for this category."
      );
    } else {
      leaderboard.forEach((entry, index) => {
        const row = document.createElement("tr");
        row.innerHTML = `
          <td>${index + 1}</td>
          <td>${entry.username}</td>
          <td>${entry.score}</td>
        `;
        tableBody.appendChild(row);
      });
      table.style.display = "table"; // Show table when data is available
    }
  })
  .catch((error) => {
    console.error("Error fetching leaderboard:", error);
    showErrorMessage(
      "Failed to load leaderboard. Please try again later."
    );
  });
}

// Display error message and hide table
function showErrorMessage(message) {
const errorMessage = document.getElementById("errorMessage");
const controls = document.getElementById("controls");
const table = document.getElementById("leaderboardTable");

errorMessage.textContent = message;
errorMessage.style.display = "block";
controls.style.display = "block"; // Show dropdown when an error occurs
table.style.display = "none"; // Ensure table is hidden on error
}