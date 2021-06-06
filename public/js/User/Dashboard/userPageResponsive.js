const user = document.getElementById("user-link");
const cart = document.getElementById("cart-link");

const mediaQueryRules = () => {
  if (window.innerWidth < 576) {
    signOutButton.classList.remove("primary-button", "custom-button");
    signOutButton.classList.add("btn", "btn-danger", "mt-3");
    user.classList.add("btn", "btn-light", "mt-3");
    cart.classList.add("btn", "btn-light", "mt-3");
  } else {
    signOutButton.classList.add("primary-button", "custom-button");
    signOutButton.classList.remove("btn", "btn-danger", "mt-3");
    user.classList.remove("btn", "btn-light", "mt-3");
    cart.classList.remove("btn", "btn-light", "mt-3");
  }
};
