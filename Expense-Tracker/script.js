// Step A: Application State & LocalStorage initialization
const STORAGE_KEY = "digital_piggybank_transactions";
let transactions = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

// Step B: DOM Elements
const transactionForm = document.getElementById("transaction-form");
const descriptionInput = document.getElementById("description");
const amountInput = document.getElementById("amount");
const typeInput = document.getElementById("type");
const categoryInput = document.getElementById("category");
const dateInput = document.getElementById("date");
const editIdInput = document.getElementById("edit-id");

const formHeading = document.getElementById("form-heading");
const submitBtn = document.getElementById("submit-btn");
const cancelBtn = document.getElementById("cancel-btn");

const totalBalanceEl = document.getElementById("total-balance");
const totalIncomeEl = document.getElementById("total-income");
const totalExpenseEl = document.getElementById("total-expense");

const transactionListEl = document.getElementById("transaction-list");
const filterCategorySelect = document.getElementById("filter-category");

// Step C: Set default date to today
dateInput.value = new Date().toISOString().split("T")[0];

// Step D: Core Helpers
function saveToLocalStorage() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
}

function formatCurrency(amount) {
  return "₹" + Number(amount).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}

// Step E: Recalculate Balance Cards
function updateSummary() {
  let incomeSum = 0;
  let expenseSum = 0;

  transactions.forEach((tx) => {
    const val = parseFloat(tx.amount);
    if (tx.type === "income") {
      incomeSum += val;
    } else {
      expenseSum += val;
    }
  });

  const balanceSum = incomeSum - expenseSum;

  totalIncomeEl.textContent = formatCurrency(incomeSum);
  totalExpenseEl.textContent = formatCurrency(expenseSum);
  totalBalanceEl.textContent = formatCurrency(balanceSum);
}

// Step F: Render Transaction History
function renderList() {
  const selectedFilter = filterCategorySelect.value;
  transactionListEl.innerHTML = "";

  const filteredTransactions = transactions.filter((tx) => {
    if (selectedFilter === "All") return true;
    return tx.category === selectedFilter;
  });

  if (filteredTransactions.length === 0) {
    transactionListEl.innerHTML = `<li class="empty-state">No transactions found.</li>`;
    return;
  }

  filteredTransactions.forEach((tx) => {
    const li = document.createElement("li");
    li.className = `transaction-item ${tx.type}`;

    const sign = tx.type === "income" ? "+" : "-";

    li.innerHTML = `
      <div class="item-details">
        <strong>${escapeHtml(tx.description)}</strong>
        <span>${escapeHtml(tx.category)} • ${tx.date}</span>
      </div>
      <div class="item-action-wrap">
        <span class="item-amount ${tx.type}">
          ${sign}${formatCurrency(tx.amount)}
        </span>
        <button class="action-btn edit-btn" onclick="startEdit('${tx.id}')">Edit</button>
        <button class="action-btn delete-btn" onclick="deleteTransaction('${tx.id}')">Delete</button>
      </div>
    `;

    transactionListEl.appendChild(li);
  });
}

// Simple HTML escaping helper for inputs
function escapeHtml(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// Step G: Add / Edit Submission
transactionForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const id = editIdInput.value;
  const description = descriptionInput.value.trim();
  const amount = parseFloat(amountInput.value);
  const type = typeInput.value;
  const category = categoryInput.value;
  const date = dateInput.value;

  if (!description || isNaN(amount) || amount <= 0) {
    alert("Please enter a valid description and positive amount.");
    return;
  }

  if (id) {
    // Edit existing entry
    const index = transactions.findIndex((tx) => tx.id === id);
    if (index !== -1) {
      transactions[index] = { id, description, amount, type, category, date };
    }
  } else {
    // Add new entry
    const newTx = {
      id: Date.now().toString(),
      description,
      amount,
      type,
      category,
      date
    };
    transactions.unshift(newTx);
  }

  saveToLocalStorage();
  resetForm();
  updateSummary();
  renderList();
});

// Step H: Delete Action
function deleteTransaction(id) {
  if (confirm("Are you sure you want to delete this transaction?")) {
    transactions = transactions.filter((tx) => tx.id !== id);
    saveToLocalStorage();
    updateSummary();
    renderList();
  }
}

// Step I: Edit Action
function startEdit(id) {
  const tx = transactions.find((item) => item.id === id);
  if (!tx) return;

  editIdInput.value = tx.id;
  descriptionInput.value = tx.description;
  amountInput.value = tx.amount;
  typeInput.value = tx.type;
  categoryInput.value = tx.category;
  dateInput.value = tx.date;

  formHeading.textContent = "Edit Transaction";
  submitBtn.textContent = "Update Transaction";
  cancelBtn.style.display = "inline-block";

  window.scrollTo({ top: 0, behavior: "smooth" });
}

// Step J: Reset Form
function resetForm() {
  transactionForm.reset();
  editIdInput.value = "";
  dateInput.value = new Date().toISOString().split("T")[0];
  formHeading.textContent = "Add New Transaction";
  submitBtn.textContent = "Add Transaction";
  cancelBtn.style.display = "none";
}

cancelBtn.addEventListener("click", resetForm);
filterCategorySelect.addEventListener("change", renderList);

// Initialize on page load
updateSummary();
renderList();