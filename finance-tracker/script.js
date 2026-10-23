
const transactionForm = document.getElementById("transactionForm");

const descriptionInput = document.getElementById("description");
const amountInput = document.getElementById("amount");
const typeInput = document.getElementById("type");

const balanceDisplay = document.getElementById("balance");
const incomeDisplay = document.getElementById("income");
const expensesDisplay = document.getElementById("expenses");

const transactionList = document.getElementById("transactionList");

let transactions = [];

const savedTransactions = localStorage.getItem("transactions");

if (savedTransactions !== null) {
    transactions = JSON.parse(savedTransactions);
}

let editingTransaction = null;
function saveTransactions() {
    localStorage.setItem("transactions", JSON.stringify(transactions));
}

// Calculate balance, income and expenses
function updateSummary() {
    let totalIncome = 0;
    let totalExpenses = 0;

    transactions.forEach(function(transaction) {
        if (transaction.type === "income") {
            totalIncome += transaction.amount;
        } else if (transaction.type === "expense") {
            totalExpenses += transaction.amount;
        }
    });

    const balance = totalIncome - totalExpenses;

    incomeDisplay.textContent = "R" + totalIncome.toFixed(2);
    expensesDisplay.textContent = "R" + totalExpenses.toFixed(2);
    balanceDisplay.textContent = "R" + balance.toFixed(2);
}


// Display all transactions
function renderTransactions() {
    transactionList.innerHTML = "";

    transactions.forEach(function(transaction) {
        const listItem = document.createElement("li");

        const transactionText = document.createElement("span");

        transactionText.textContent =
            transaction.description + " - R" +
            transaction.amount.toFixed(2) + " (" +
            transaction.type + ")";

        // Edit button
        const editButton = document.createElement("button");
        editButton.textContent = "Edit";

        editButton.addEventListener("click", function() {
            descriptionInput.value = transaction.description;
            amountInput.value = transaction.amount;
            typeInput.value = transaction.type;

            editingTransaction = transaction;
        });

        // Delete button
        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";

        deleteButton.addEventListener("click", function() {
            const index = transactions.indexOf(transaction);

            transactions.splice(index, 1);
            saveTransactions();

            if (editingTransaction === transaction) {
                editingTransaction = null;
                transactionForm.reset();
            }

            renderTransactions();
            updateSummary();
        });

        listItem.appendChild(transactionText);
        listItem.appendChild(editButton);
        listItem.appendChild(deleteButton);

        transactionList.appendChild(listItem);
    });
}


// Handle adding and editing transactions
transactionForm.addEventListener("submit", function(event) {
    event.preventDefault();

    const description = descriptionInput.value.trim();
    const amount = Number(amountInput.value);
    const type = typeInput.value;

    if (description === "" || amount <= 0 || !Number.isFinite(amount)) {
        return;
    }

    if (editingTransaction !== null) {
        // Update the existing transaction
        editingTransaction.description = description;
        editingTransaction.amount = amount;
        editingTransaction.type = type;

        editingTransaction = null;
    } else {
        // Add a new transaction
        const transaction = {
            description: description,
            amount: amount,
            type: type
        };

        transactions.push(transaction);
    }

    saveTransactions();

    transactionForm.reset();
});

renderTransactions();
updateSummary();
