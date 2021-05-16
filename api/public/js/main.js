//jshint:esversion:6
const fakeloader = $("#fakeloader-overlay");
fakeloader.hide();
fetch("/checkUser").then((status) => {
  // console.log(status);
  if (status.status == 500) {
    window.location.assign("http://localhost:8000/login");
  }
});
var menuButton = document.getElementById("menu-button");
var signOutButton = document.getElementById("signOutButton");
menuButton.addEventListener("click", () => {
  window.location.assign("http://localhost:8000/menu");
});

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
