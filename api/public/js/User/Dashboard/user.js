var signOutButton = document.getElementById("signOutButton");
const userDetailsSidebar = document.getElementById("sidebar-user-details");
const orderHistorySidebar = document.getElementById("sidebar-order-history");
const paymentHistorySidebar = document.getElementById(
  "sidebar-payment-hisotry"
);
const active = "bg-danger text-white";
signOutButton.addEventListener("click", () => {
  fakeloader.show();
  fetch("http://localhost:8000/signOut").then((res) => {
    const statusCode = res.status;
    if (statusCode === 200) {
      fakeloader.hide();
      localStorage.clear();
      window.location.assign("/login");
    }
  });
});
window.addEventListener("resize", () => {
  mediaQueryRules();
});
function clearActiveClassSidebar() {
  const selector = "#sidebar-pages li";
  $(selector).on("click", function () {
    $(selector).removeClass(active).addClass("bg-light");
    $(this).addClass(active).removeClass("bg-light");
    // console.log($(this).data("name"))
    const currentActiveId = $(this).data("name");
    // console.log($(`#${currentActiveId}`).hasClass("d-none"))
    $(".sidebar-items").addClass("d-none");
    if ($(`#${currentActiveId}`).hasClass("d-none") === true) {
      $(`#${currentActiveId}`).removeClass("d-none");
    }
  });
}
mediaQueryRules();
clearActiveClassSidebar();
