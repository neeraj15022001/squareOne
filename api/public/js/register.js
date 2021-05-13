const errorBox = document.querySelector(".error");
errorBox.style.visibility = "hidden";
const fakeloader = $("#fakeloader-overlay");
fakeloader.hide();
var registerButton = document.getElementById("register-button");
// event listeners
initializeFirebaseApp();
makeEventListeners({button: registerButton})
registerButton.addEventListener("click", function (e) {
    e.preventDefault();
    if (emailField.value !== "" && passwordField.value !== "") {
      registerButton.setAttribute("disabled", "true");
      fakeloader.show();
      createUserWithEmailAndPassword({
        email: emailField.value,
        password: passwordField.value,
      });
    }
  });