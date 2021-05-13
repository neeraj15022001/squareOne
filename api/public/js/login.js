const errorBox = document.querySelector(".error");
errorBox.style.visibility = "hidden";
const fakeloader = $("#fakeloader-overlay");
fakeloader.hide();
var signInButton = document.getElementById("sign-in-button");
// event listeners
initializeFirebaseApp();
makeEventListeners({button: signInButton})
signInButton.addEventListener("click", function (e) {
  e.preventDefault();
  if (emailField.value !== "" && passwordField.value !== "") {
    signInButton.setAttribute("disabled", "true");
    fakeloader.show();
    // signIn(emailField.value, passwordField.value);
    signInUserWithEmailAndPassword({
      email: emailField.value,
      password: passwordField.value,
    });
  }
});


