function checkInputFields({ emailField, passwordField }) {
  // console.log(emailField.value, passwordField.value);
  if (emailField.value === "" || passwordField.value === "") {
    return true;
  } else {
    return false;
  }
}
function buttonCurrentState({ isEmpty, button }) {
  if (isEmpty) {
    button.setAttribute("disabled", "true");
  } else {
    button.removeAttribute("disabled");
  }
}
function checkPasswordLength({ passwordField }) {
  if (passwordField.value.length >= 6) {
    return true;
  } else {
    return false;
  }
}
