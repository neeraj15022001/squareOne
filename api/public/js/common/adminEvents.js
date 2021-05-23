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
