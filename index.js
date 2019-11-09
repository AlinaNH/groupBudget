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

/* Sign up */

document.getElementById("submitSignUp").addEventListener("click", () => {
  let groupEmail = document.getElementById("groupEmailForSignUp").value,
    groupPassword = document.getElementById("groupPasswordForSignUp").value;

  firebase
    .auth()
    .createUserWithEmailAndPassword(groupEmail, groupPassword)
    .then(() => signInSystemSuccesfull("Up"))
    .catch(error => signInSystemFailed(error, "Up"));
});

/* Sign In */

document.getElementById("submitSignIn").addEventListener("click", () => {
  let groupEmail = document.getElementById("groupEmailForSignIn").value,
    groupPassword = document.getElementById("groupPasswordForSignIn").value;

  firebase
    .auth()
    .signInWithEmailAndPassword(groupEmail, groupPassword)
    .then(() => signInSystemSuccesfull("In"))
    .catch(error => signInSystemFailed(error, "In"));
});

/* Functions */

function signInSystemSuccesfull(sign) {
  let messageContainer = document.getElementById(
      "containerForMessageSign" + sign
    ),
    message = document.getElementById("messageForSign" + sign);

  messageContainer.classList.remove("d-none");
  messageContainer.classList.remove("alert-danger");
  messageContainer.classList.add("alert-success");

  if (sign === "Up") {
    message.innerHTML = "Welcome! You are registered in the system!";
    setTimeout(() => {
      $("#signUpModal").modal("hide");
      $("#signInModal").modal("show");
    }, 1000);
  } else if (sign === "In") {
    message.innerHTML = "Welcome! Redirected to the system...";
    localStorage.setItem("accountID", firebase.auth().currentUser.uid);
    setTimeout(
      () =>
        (document.location.href = "/groupBudget/src/pages/addExpenses.html"),
      1500
    );
  }
}

function signInSystemFailed(error, sign) {
  let messageContainer = document.getElementById(
      "containerForMessageSign" + sign
    ),
    message = document.getElementById("messageForSign" + sign);

  if (error.code) {
    messageContainer.classList.remove("d-none");
    messageContainer.classList.add("d-flex");
    messageContainer.classList.remove("alert-success");
    messageContainer.classList.add("alert-danger");
    message.innerHTML = error.message;
  }

  document
    .getElementById("formForSign" + sign)
    .addEventListener("click", event => {
      if (event.target.tagName === "INPUT") {
        messageContainer.classList.remove("d-flex");
        messageContainer.classList.add("d-none");
      }
    });
}
