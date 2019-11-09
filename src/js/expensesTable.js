/* Sorting table */

$(document).ready(function() {
  getDatafromFirebase();
  addExpensesDataToTable();
  $("#sortTable").DataTable();
  document.getElementById("sortTable_wrapper").classList.remove("form-inline");
  document.getElementById("sortTable").parentNode.classList.add("flex-grow-1");
});

/* Remember dataID*/

document.getElementById("tableData").addEventListener("click", function(event) {
  let dataID;

  if (event.target.tagName === "I") {
    if (event.target.getAttribute("data-idforupdating")) {
      dataID = event.target.getAttribute("data-idforupdating");
      localStorage.setItem("dataID", dataID);
      fillUpdatingForm(dataID);
    } else if (event.target.getAttribute("data-idfordeleting")) {
      dataID = event.target.getAttribute("data-idfordeleting");
      localStorage.setItem("dataID", dataID);
    }
  }
});

/* Delete data */

function fillUpdatingForm(dataID) {
  let expensesData = JSON.parse(localStorage.getItem("data")),
    dataByID = {};

  for (let data in expensesData) {
    if (data === dataID) dataByID = expensesData[data];
  }

  document.getElementById("expenseDate").value = dataByID.expenseDate;
  document.getElementById("payerName").value = dataByID.payerName;
  document.getElementById("expenseValue").value = dataByID.expenseValue;
  document.getElementById("categoryOfExpense").value =
    dataByID.categoryOfExpense;
  document.getElementById("commentForExpense").value =
    dataByID.commentForExpense;
}

document.getElementById("deleteData").addEventListener("click", function() {
  let accountID = localStorage.getItem("accountID"),
    IDForDeleting = localStorage.getItem("dataID"),
    i = document.querySelector("[data-idfordeleting=" + IDForDeleting + "]"),
    tr = i.parentNode.parentNode,
    tableData = document.getElementById("tableData");

  firebase
    .database()
    .ref("expensesDatabase/" + accountID + "/" + IDForDeleting)
    .remove()
    .then(() => {
      messageSuccessfull();
    })
    .catch(error => {
      messageFailed(error);
    });
  tableData.removeChild(tr);
  firebase
    .database()
    .ref("expensesDatabase/" + accountID + "/")
    .once("value")
    .then(snapshot => {
      let data = snapshot.val();
      localStorage.setItem("data", JSON.stringify(data));
    });
});

/* Hide message in modal after deleting */

$("#modalForDeleting").on("hidden.bs.modal", () => {
  let messageContainer = document.getElementById("containerForMessage");

  messageContainer.classList.remove("d-flex");
  messageContainer.classList.add("d-none");
});

/* Save data in json object */

document.getElementById("saveData").addEventListener("click", () => {
  let backupData = localStorage.getItem("data");
  downloadJSONFile(backupData);
});

/* Functions */

function getDatafromFirebase() {
  let accountID = localStorage.getItem("accountID");

  firebase
    .database()
    .ref("expensesDatabase/" + accountID + "/")
    .once("value")
    .then(snapshot => {
      let data = snapshot.val();
      localStorage.setItem("data", JSON.stringify(data));
    });
}

function addExpensesDataToTable() {
  let expensesData = JSON.parse(localStorage.getItem("data")),
    sortedData,
    tr,
    td,
    dataTextNode,
    tableData;

  if (expensesData) {
    for (let data in expensesData) {
      sortedData = [
        expensesData[data].expenseDate,
        expensesData[data].payerName,
        expensesData[data].expenseValue,
        expensesData[data].categoryOfExpense,
        expensesData[data].commentForExpense
      ];
      tr = document.createElement("tr");
      tableData = document.getElementById("tableData");

      for (let data in sortedData) {
        td = document.createElement("td");
        dataTextNode = document.createTextNode(sortedData[data]);
        td.appendChild(dataTextNode);
        tr.appendChild(td);
      }
      tr.insertAdjacentHTML(
        "beforeend",
        "<td><i class='fa fa-edit text-success lead update' aria-hidden='true' data-toggle='modal' data-target='#modalForUpdating'></i></td>"
      );
      tr.insertAdjacentHTML(
        "beforeend",
        "<td><i class='fa fa-trash text-danger lead delete' aria-hidden='true' data-toggle='modal' data-target='#modalForDeleting'></i></td>"
      );
      tableData.appendChild(tr);
    }
    identificateData(expensesData);
  }
}

function identificateData(expensesData) {
  let dataID = Object.keys(expensesData),
    tableData = document.getElementById("tableData"),
    trashIcons = tableData.getElementsByClassName("delete"),
    editIcons = tableData.getElementsByClassName("update");
  for (let i = 0; i < trashIcons.length; i++) {
    trashIcons[i].setAttribute("data-idfordeleting", dataID[i]);
  }
  for (let i = 0; i < editIcons.length; i++) {
    editIcons[i].setAttribute("data-idforupdating", dataID[i]);
  }
}

function messageSuccessfull(operation) {
  let messageContainer = document.getElementById("containerForMessageDeleting"),
    message = document.getElementById("messageDeleting");

  messageContainer.classList.remove("d-none");
  messageContainer.classList.add("d-flex");
  messageContainer.classList.remove("alert-danger");
  messageContainer.classList.add("alert-success");
  message.innerHTML = "The data has been deleted succesfully";

  setTimeout(() => {
    $("#modalForUpdating").modal("hide");
    $("#modalForDeleting").modal("hide");
  }, 1000);
}

function messageFailed(error, operation) {
  let messageContainer = document.getElementById("containerForMessageDeleting"),
    message = document.getElementById("messageDeleting");

  messageContainer.classList.remove("d-none");
  messageContainer.classList.add("d-flex");

  if (error) {
    messageContainer.classList.remove("alert-success");
    messageContainer.classList.add("alert-danger");
    message.innerHTML = "Sorry, something is going wrong. Please, try later.";
  }

  setTimeout(() => {
    $("#signUpModal").modal("hide");
    $("#signInModal").modal("hide");
  }, 1000);
}

function downloadJSONFile(data) {
  var blob = new Blob([data], { type: "text/plain;charset=utf-8" });
  saveAs(blob, "groupBudget.json");
}
