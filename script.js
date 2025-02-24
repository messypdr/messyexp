const yearSelect = document.getElementById("year-select");
const monthSelect = document.getElementById("month-select");
const calendar = document.getElementById("calendar");
const noteInput = document.getElementById("note-input");
const saveNoteBtn = document.getElementById("save-note");
const deleteNoteBtn = document.getElementById("delete-note");
const resetButton = document.getElementById("reset-expenses");
const toggleThemeBtn = document.getElementById("toggle-theme");
const goBackBtn = document.getElementById("go-back");
const totalExpensesDisplay = document.getElementById("total-expenses");
const selectedDateDisplay = document.getElementById("selected-date");
const expenseButtons = document.querySelectorAll("#expense-controls button");

// New delete expense button
const deleteExpenseBtn = document.createElement("button");
deleteExpenseBtn.textContent = "Delete Expense for Selected Date";
deleteExpenseBtn.id = "delete-expense";
deleteExpenseBtn.style.background = "#dc3545";
deleteExpenseBtn.style.color = "white";
deleteExpenseBtn.style.padding = "8px 12px";
deleteExpenseBtn.style.margin = "10px";
deleteExpenseBtn.style.border = "none";
deleteExpenseBtn.style.borderRadius = "5px";
deleteExpenseBtn.style.fontWeight = "bold";
deleteExpenseBtn.style.cursor = "pointer";

// Insert delete expense button in the expense control section
document.getElementById("expense-controls").appendChild(deleteExpenseBtn);

let selectedDateKey = null;
let expenses = JSON.parse(localStorage.getItem("expenses")) || {};
let notes = JSON.parse(localStorage.getItem("notes")) || {};

const mealPrices = { breakfast: 15, lunch: 50, dinner: 50, fullDay: 115 };

// Populate year and month dropdowns
for (let i = 2020; i <= 2030; i++) {
    yearSelect.add(new Option(i, i));
}
for (let i = 0; i < 12; i++) {
    monthSelect.add(new Option(new Date(2025, i, 1).toLocaleString("default", { month: "long" }), i));
}

// Set default selected year and month
yearSelect.value = new Date().getFullYear();
monthSelect.value = new Date().getMonth();

// Function to generate calendar
function generateCalendar() {
    calendar.innerHTML = "";
    const year = parseInt(yearSelect.value);
    const month = parseInt(monthSelect.value);
    const totalDays = new Date(year, month + 1, 0).getDate();

    for (let day = 1; day <= totalDays; day++) {
        const dayCell = document.createElement("div");
        dayCell.classList.add("day");
        dayCell.textContent = day;
        const key = `${year}-${month}-${day}`;

        if (expenses[key]) {
            dayCell.innerHTML += `<div class="expense-display">₹${expenses[key]}</div>`;
        }

        dayCell.addEventListener("click", () => selectDate(key, day, dayCell));
        calendar.appendChild(dayCell);
    }
    calculateTotalExpenses();
}

// Function to select a date
function selectDate(key, day, element) {
    selectedDateKey = key;
    selectedDateDisplay.textContent = ` ${day}`;

    // Remove existing selection highlight
    document.querySelectorAll(".day").forEach((d) => d.classList.remove("selected-day"));
    element.classList.add("selected-day");

    // Display saved notes
    noteInput.value = notes[key] || "";
}

// Function to add expense
expenseButtons.forEach((button) => {
    button.addEventListener("click", () => {
        if (!selectedDateKey) return;
        const expenseType = button.getAttribute("data-expense");
        const expenseAmount = mealPrices[expenseType];

        // Update expense for selected date
        if (!expenses[selectedDateKey]) expenses[selectedDateKey] = 0;
        expenses[selectedDateKey] += expenseAmount;

        // Save to localStorage
        localStorage.setItem("expenses", JSON.stringify(expenses));

        // Refresh calendar
        generateCalendar();
    });
});

// Function to delete expense for selected date
deleteExpenseBtn.addEventListener("click", () => {
    if (!selectedDateKey || !expenses[selectedDateKey]) return;
    
    delete expenses[selectedDateKey]; // Remove the expense for the selected date
    localStorage.setItem("expenses", JSON.stringify(expenses)); // Update storage
    generateCalendar(); // Refresh calendar
});

// Function to calculate total expenses
function calculateTotalExpenses() {
    let total = Object.values(expenses).reduce((sum, val) => sum + val, 0);
    totalExpensesDisplay.textContent = total;
}

// Save note functionality
saveNoteBtn.addEventListener("click", () => {
    if (!selectedDateKey) return;
    notes[selectedDateKey] = noteInput.value;
    localStorage.setItem("notes", JSON.stringify(notes));
});

// Delete note functionality
deleteNoteBtn.addEventListener("click", () => {
    if (!selectedDateKey) return;
    delete notes[selectedDateKey];
    noteInput.value = "";
    localStorage.setItem("notes", JSON.stringify(notes));
});

// Toggle theme functionality
toggleThemeBtn.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
});

// Go back button functionality
goBackBtn.addEventListener("click", () => {
    history.back();
});

// Reset expenses functionality
resetButton.addEventListener("click", () => {
    localStorage.removeItem("expenses");
    localStorage.removeItem("notes");
    expenses = {};
    notes = {};
    generateCalendar();
});

// Event listeners for dropdown change
yearSelect.addEventListener("change", generateCalendar);
monthSelect.addEventListener("change", generateCalendar);

// Generate calendar on load
generateCalendar();