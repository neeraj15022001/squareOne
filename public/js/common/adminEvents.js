$("#menu-toggle-button").click(() => {
  $("#sidebar").toggleClass("w-25").toggleClass("p-3");
});

$("#dropdownMenuButton").click(() => {
  $("#dropdown-icon")
    .toggleClass("bi-caret-up-fill")
    .toggleClass("bi-caret-down-fill");
});
$("#adminUsers").click(() => {
  window.location.assign("/admin");
});
$("#adminPayment").click(() => {
  window.location.assign("/paymentHistory");
});
$("#adminOrder").click(() => {
  window.location.assign("/orderHistory");
});

const signOutButton = document.getElementById("sign-out-button");
signOutButton.addEventListener("click", () => {
  fakeloader.show();
  fetch("/signOut").then((res) => {
    const statusCode = res.status;
    if (statusCode === 200) {
      fakeloader.hide();
      window.location.assign("/login");
    }
  });
});
