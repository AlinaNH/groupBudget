/* expense Categories */

var expenseCategories = {
  Food: {
    1: "Grocery",
    2: "Cafe",
    3: "Restaurant",
    4: "Other expenses for food"
  },
  Utilities: {
    1: "Cosmetics",
    2: "Hygiene products",
    3: "Cleaning products",
    4: "Other expenses for utilities"
  },
  Shopping: {
    1: "Clothes",
    2: "Accessories",
    3: "Products for home",
    4: "Other expenses for shopping"
  },
  Entertaiment: {
    1: "Cinema",
    2: "Concert",
    3: "Public entertaiment",
    4: "Other expenses for entertaiment"
  },
  "Household expenses": {
    1: "Communal payments",
    2: "Hot water",
    3: "Cold water",
    4: "Light",
    5: "Internet",
    6: "Phone",
    7: "Rent",
    8: "Other household expenses"
  },
  "Other expenses": {
    1: "Vacation",
    2: "Medicine",
    3: "Gifts",
    4: "Expenses for car",
    5: "Other expenses"
  }
};

/* Firebase Config */

var firebaseConfig = {
  apiKey: "AIzaSyCMLNAMBI8fDNhaLa9W_S_tSkLQQkOr3JA",
  authDomain: "group-budget-bb3f0.firebaseapp.com",
  databaseURL: "https://group-budget-bb3f0.firebaseio.com",
  projectId: "group-budget-bb3f0",
  storageBucket: "",
  messagingSenderId: "85631761084",
  appId: "1:85631761084:web:2c256bad3c098b6b226eb9",
  measurementId: "G-GNDJNZ4E8L"
};

firebase.initializeApp(firebaseConfig);
var database = firebase.database();

moment().format();

/* Add expense categories */

addExpenseCategories();

/* Add data */

if (document.getElementById("submitExpense")) {
  document.getElementById("submitExpense").addEventListener("click", () => {
    let accountID = localStorage.getItem("accountID"),
      expenseID = database
        .ref("expensesDatabase/" + accountID)
        .push()
        .getKey(),
      expenseData = checkIsInputsAreEmpty();

    if (expenseData) {
      firebase
        .database()
        .ref("expensesDatabase/" + accountID + "/" + expenseID)
        .set(
          {
            expenseDate: expenseData.expenseDate,
            payerName: expenseData.payerName,
            expenseValue: expenseData.expenseValue,
            categoryOfExpense: expenseData.expenseCategory,
            commentForExpense: expenseData.commentForExpense
          },
          error => {
            addingExpensesFailed(error);
          }
        );
      firebase
        .database()
        .ref("expensesDatabase/" + accountID + "/")
        .once("value")
        .then(snapshot => {
          let data = snapshot.val();
          localStorage.setItem("data", JSON.stringify(data));
        });
    }
  });
}

/* Update Data */

if (document.getElementById("submitUpdates")) {
  document.getElementById("submitUpdates").addEventListener("click", () => {
    let accountID = localStorage.getItem("accountID"),
      expenseID = localStorage.getItem("dataID"),
      expenseData = checkIsInputsAreEmpty();

    if (expenseData) {
      firebase
        .database()
        .ref("expensesDatabase/" + accountID + "/" + expenseID)
        .set(
          {
            expenseDate: expenseData.expenseDate,
            payerName: expenseData.payerName,
            expenseValue: expenseData.expenseValue,
            categoryOfExpense: expenseData.expenseCategory,
            commentForExpense: expenseData.commentForExpense
          },
          error => {
            addingExpensesFailed(error);
          }
        );
      firebase
        .database()
        .ref("expensesDatabase/" + accountID + "/")
        .once("value")
        .then(snapshot => {
          let data = snapshot.val();
          localStorage.setItem("data", JSON.stringify(data));
        });
    }
  });
}

/* Functions */

function addExpenseCategories() {
  let selectExpenseCategory = document.getElementById("categoryOfExpense"),
    optGroup,
    option,
    optionText;

  for (let categoryGroup in expenseCategories) {
    optGroup = document.createElement("optgroup");
    optGroup.setAttribute("label", categoryGroup);
    for (let category in expenseCategories[categoryGroup]) {
      option = document.createElement("option");
      option.setAttribute("value", expenseCategories[categoryGroup][category]);
      optionText = document.createTextNode(
        expenseCategories[categoryGroup][category]
      );
      option.appendChild(optionText);
      optGroup.appendChild(option);
    }
    selectExpenseCategory.appendChild(optGroup);
  }
}

function checkIsInputsAreEmpty() {
  let expenseDate = document.getElementById("expenseDate").value,
    payerName = document.getElementById("payerName").value,
    expenseValue = document.getElementById("expenseValue").value,
    expenseCategory = document.getElementById("categoryOfExpense").value,
    commentForExpense = document.getElementById("commentForExpense").value,
    expenseData = {};

  if (!expenseDate || !payerName || !expenseValue) {
    showMessageAboutEmptyInputs();
    return false;
  } else {
    expenseData.expenseDate = moment(expenseDate).format("L");
    expenseData.payerName = payerName;
    expenseData.expenseValue = expenseValue;
    expenseData.expenseCategory = expenseCategory;
    expenseData.commentForExpense = commentForExpense;
    return expenseData;
  }
}

function showMessageAboutEmptyInputs() {
  let messageContainer = document.getElementById("containerForMessageUpdating"),
    message = document.getElementById("messageUpdating");

  document
    .getElementById("formForAddingExpenses")
    .classList.add("was-validated");
  messageContainer.classList.remove("d-none");
  messageContainer.classList.add("d-flex");
  messageContainer.classList.remove("alert-success");
  messageContainer.classList.add("alert-danger");
  message.innerHTML =
    'The fields "Date", "Your name" and "Expense Value" must not be empty. Please, fill them.';
  hideMessageContainer();
}

function addingExpensesFailed(error) {
  let messageContainer = document.getElementById("containerForMessage"),
    message = document.getElementById("message");

  messageContainer.classList.remove("d-none");
  messageContainer.classList.add("d-flex");
  if (error) {
    messageContainer.classList.remove("alert-success");
    messageContainer.classList.add("alert-danger");
    message.innerHTML = "Sorry, something is going wrong. Please, try later.";
  } else {
    messageContainer.classList.remove("alert-danger");
    messageContainer.classList.add("alert-success");
    message.innerHTML = "Congratulations! The data has been saved succesfully";
    setTimeout(() => location.reload(), 2000);
  }
  hideMessageContainer();
}

function hideMessageContainer() {
  document
    .getElementById("formForAddingExpenses")
    .addEventListener("click", event => {
      let messageContainer = document.getElementById("containerForMessage");

      if (
        event.target.tagName === "INPUT" ||
        event.target.tagName === "TEXTAREA"
      ) {
        messageContainer.classList.remove("d-flex");
        messageContainer.classList.add("d-none");
      }
    });
}
