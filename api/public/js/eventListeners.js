function makeEventListeners({ button }) {
  const emailField = document.getElementById("emailField");
  const passwordField = document.getElementById("passwordField");
  const isEmpty = checkInputFields({
    emailField: emailField,
    passwordField: passwordField,
  });
  buttonCurrentState({ isEmpty: isEmpty, button: button });
  emailField.addEventListener("change", () => {
    let isEmpty = checkInputFields({
      emailField: emailField,
      passwordField: passwordField,
    });
    buttonCurrentState({ isEmpty: isEmpty, button: button });
  });
  passwordField.addEventListener("keyup", () => {
    let isEmpty = checkInputFields({
      emailField: emailField,
      passwordField: passwordField,
    });
    let isGreaterThanSix = checkPasswordLength({
      passwordField: passwordField,
    });
    if (isGreaterThanSix && !isEmpty) {
      buttonCurrentState({ isEmpty: false, button: button });
    } else {
      buttonCurrentState({ isEmpty: true, button: button });
    }
  });
}
