//jshint:esversion:6
const fakeloader = $("#fakeloader-overlay");
fakeloader.hide();
fetch("/checkUser").then((status) => {
  // console.log(status);
  if (status.status == 500) {
    window.location.assign("login");
  }
});
var menuButton = document.getElementById("menu-button");
var signOutButton = document.getElementById("signOutButton");
menuButton.addEventListener("click", () => {
  window.location.assign("/menu");
});

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
