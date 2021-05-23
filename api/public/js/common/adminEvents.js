$("#menu-toggle-button").click(() => {
  $("#sidebar").toggleClass("w-25").toggleClass("p-3");
});

$("#dropdownMenuButton").click(() => {
  $("#dropdown-icon")
    .toggleClass("bi-caret-up-fill")
    .toggleClass("bi-caret-down-fill");
});
$("#adminUsers").click(() => {
  window.location.assign("http://localhost:8000/admin");
});
$("#adminPayment").click(() => {
  window.location.assign("http://localhost:8000/paymentHistory");
});
$("#adminOrder").click(() => {
  window.location.assign("http://localhost:8000/orderHistory");
});

const signOutButton = document.getElementById("sign-out-button")
  signOutButton.addEventListener("click", () => {
    fakeloader.show();
    fetch("http://localhost:8000/signOut").then((res) => {
      const statusCode = res.status;
      if (statusCode === 200) {
        fakeloader.hide();
        window.location.assign("/login");
      }
    });
  });
