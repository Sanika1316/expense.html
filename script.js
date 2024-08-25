// Get elements
const incomeForm = document.getElementById('income-form');
const expensesForm = document.getElementById('expenses-form');
const incomeList = document.getElementById('income-list');
const expensesList = document.getElementById('expenses-list');
const totalIncomeSpan = document.getElementById('total-income');
const totalExpensesSpan = document.getElementById('total-expenses');
const netIncomeSpan = document.getElementById('net-income');
const filterCategorySelect = document.getElementById('filter-category');
const filterBtn = document.getElementById('filter-btn');
const chartCanvas = document.getElementById('chart');
const exportBtn = document.getElementById('export-btn');
const importBtn = document.getElementById('import-btn');

// Initialize data
let incomeData = [];
let expensesData = [];

// Add income
incomeForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const incomeDate = document.getElementById('income-date').value;
  const incomeDescription = document.getElementById('income-description').value;
  const incomeAmount = document.getElementById('income-amount').value;
  incomeData.push({ date: incomeDate, description: incomeDescription, amount: incomeAmount });
  updateIncomeList();
  updateSummary();
});

// Add expense
expensesForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const expensesDate = document.getElementById('expenses-date').value;
  const expensesDescription = document.getElementById('expenses-description').value;
  const expensesCategory = document.getElementById('expenses-category').value;
  const expensesAmount = document.getElementById('expenses-amount').value;
  expensesData.push({ date: expensesDate, description: expensesDescription, category: expensesCategory, amount: expensesAmount });
  updateExpensesList();
  updateSummary();
});

// Update income list
function updateIncomeList() {
  incomeList.innerHTML = '';
  incomeData.forEach((income) => {
    const incomeListItem = document.createElement('li');
    incomeListItem.textContent = `${income.date} - ${income.description} - ${income.amount}`;
    incomeList.appendChild(incomeListItem);
  });
}

// Update expenses list
function updateExpensesList() {
  expensesList.innerHTML = '';
  expensesData.forEach((expense) => {
    const expensesListItem = document.createElement('li');
    expensesListItem.textContent = `${expense.date} - ${expense.description} - ${expense.category} - ${expense.amount}`;
    expensesList.appendChild(expensesListItem);
  });
}

// Update summary
function updateSummary() {
  const totalIncome = incomeData.reduce((acc, income) => acc + income.amount, 0);
  const totalExpenses = expensesData.reduce((acc, expense) => acc + expense.amount, 0);
  const netIncome = totalIncome - totalExpenses;
  totalIncomeSpan.textContent = totalIncome;
  totalExpensesSpan.textContent = totalExpenses;
  netIncomeSpan.textContent = netIncome;
}

// Filter expenses
filterBtn.addEventListener('click', () => {
  const filterCategory = filterCategorySelect.value;
  const filteredExpenses = expensesData.filter((expense) => expense.category === filterCategory);
  updateExpensesList(filteredExpenses);
});

// Create chart
const chart = new Chart(chartCanvas, {
  type: 'pie',
  data: {
    labels: expensesData.map((expense) => expense.category),
    datasets: [{
      label: 'Expenses by Category',
      data: expensesData.map((expense) => expense.amount),
      backgroundColor: [
        'rgba(255, 99, 132, 0.2)',
        'rgba(54, 162, 235, 0.2)',
        'rgba(255, 206, 86, 0.2)',
        'rgba(75, 192, 192, 0.2)',
      ],
      borderColor: [
        'rgba(255, 99, 132, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
      ],
      borderWidth: 1
    }]
  },
  options: {
    title: {
      display: true,
      text: 'Expenses by Category'
    }
  }
});

// Export data
exportBtn.addEventListener('click', () => {
  const data = { income: incomeData, expenses: expensesData };
  const json = JSON.stringify(data);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'expense-tracker-data.json';
  a.click();
});

// Import data
importBtn.addEventListener('click', () => {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = '.json';
  input.addEventListener('change', (e)