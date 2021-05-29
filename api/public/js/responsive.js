const brand = document.querySelector(".brand");
const navbar = document.getElementById("navbar");
const user = document.getElementById("user-link");
const cart = document.getElementById("cart-link");

const mediaQueryRules = () => {
    console.log("calling function")
    if (window.innerWidth <= 1200) {
      body.style.background = "url('../images/Home/md.jpg')";
      body.style.backgroundSize = "cover";
      body.style.backgroundAttachment = "fixed";
      body.style.backgroundColor = "none";
      brand.style.color = "white";
    } else {
      body.style.background = "#ffffff";
      brand.style.color = "black";
    }
    if (window.innerWidth < 576) {
      navbar.classList.remove("navbar-dark");
      navbar.classList.add("bg-navbar", "navbar-light");
      signOutButton.classList.remove("primary-button", "custom-button");
      signOutButton.classList.add("btn", "btn-danger", "mt-3");
      user.classList.add("btn", "btn-light", "mt-3");
      cart.classList.add("btn", "btn-light", "mt-3");
    } else {
      navbar.classList.add("navbar-dark");
      navbar.classList.remove("bg-navbar", "navbar-light");
      signOutButton.classList.add("primary-button", "custom-button");
      signOutButton.classList.remove("btn", "btn-danger", "mt-3");
      user.classList.remove("btn", "btn-light", "mt-3");
      cart.classList.remove("btn", "btn-light", "mt-3");
    }
  };