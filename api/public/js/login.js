const errorBox = document.querySelector(".error");
errorBox.style.visibility= "hidden"
const fakeloader = $("#fakeloader-overlay")
fakeloader.hide()
initializeApp();
var signInButton = document.getElementById("sign-in-button");
const emailField = document.getElementById("emailField");
const passwordField = document.getElementById("passwordField");
const isEmpty = checkInputFields()
buttonCurrentState(isEmpty)
emailField.addEventListener("change", () => {
  let isEmpty = checkInputFields()
  buttonCurrentState(isEmpty)
})
passwordField.addEventListener("keyup", () => {
  let isEmpty = checkInputFields()
  let isGreaterThanSix = checkPasswordLength()
  if(isGreaterThanSix && !isEmpty) {
    buttonCurrentState(false)
  } else {
    buttonCurrentState(true)
  }
})
signInButton.addEventListener("click", function (e) {
  e.preventDefault();
  if (emailField.value !== "" && passwordField.value !== "") {
    signInButton.setAttribute("disabled", "true");
    fakeloader.show()
    signIn(emailField.value, passwordField.value);
  }
});

function initializeApp() {
  fetch("http://localhost:8000/")
    .then((response) => {
      console.log(response.status);
      let statusCode = response.status;
      if (statusCode === 200) {
        console.log("App is successFully Initialized");
      } else {
        console.log("App is initiaized again");
      }
    })
    .then(() => checkUser())
    .catch(e => console.log(e))
}

function checkUser() {
  try {
    fetch("http://localhost:8000/getCurrentUser").then((res) => {
      let statusCode = res.status;
      if (statusCode === 200) {
        fakeloader.hide()
        window.location.assign("./index.html");
      }
    }); 
  } catch (error) {
    console.log(error);
  }
}

function signIn(email, password) {
  console.log("logging in......");
  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

  var urlencoded = new URLSearchParams();
  urlencoded.append("email", email);
  urlencoded.append("password", password);

  var requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: urlencoded,
    redirect: "follow",
  };
  fetch("http://localhost:8000/login", requestOptions)
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
      if (data.status === 200) {
        window.location.assign("./index.html");
        console.log(data.user.uid);
        signInButton.removeAttribute("disabled");
        fakeloader.hide()
      }
      else {
        errorBox.style.visibility= "visible"
        errorBox.innerHTML = data.errorMessage;
        setTimeout(() => {
          errorBox.style.visibility= "hidden";
          signInButton.removeAttribute("disabled");
          fakeloader.hide()
        }, 3000)
      }
    })
    .catch((error) => {
      console.log("error", error)
    });
}

function checkInputFields() {
  console.log(emailField.value, passwordField.value)
  if(emailField.value === "" || passwordField.value === "") {
    return true
  } else {
    return false
  }
}

function buttonCurrentState(isEmpty) {
  if(isEmpty) {
    signInButton.setAttribute("disabled","true")
  } else {
    signInButton.removeAttribute("disabled")
  }
}

function checkPasswordLength() {
  if(passwordField.value.length >= 6) {
    return true
  } else {
    return false
  }
}
